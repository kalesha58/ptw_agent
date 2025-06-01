import OpenAI from "openai";
import dotenv from "dotenv";
import { functions } from "./helper/fuctions.js";
import fetch from "node-fetch";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Chat loop with improved error handling and structured error objects.
 * Returns either:
 * - A plain string or object reply from LLM/function flows
 * - An object of form { type: "error", errorCode: string, message: string, httpStatus?: number }
 */
export async function chatLoop(userMessage) {
  const conversation = [
    {
      role: "system",
      content: `
        You are PTW Sentinel—an intelligent assistant for a digital Permit to Work system.
        You help users find permit information using permit IDs, task names, requester names, or department names.
        If a user asks about a permit without providing the permit ID, search by task name or requester name.
        Your goal is to understand what the user is asking—status, history, contractor, safety, etc.—and call the appropriate function.
        Respond clearly and concisely. Ask clarifying questions if essential info is missing.
      `.trim()
    },
    { role: "user", content: userMessage }
  ];

  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversation,
      functions,
      function_call: "auto",
    });
  } catch (err) {
    console.error("OpenAI API error (initial):", err);
    return { type: "error", errorCode: "OPENAI_API_ERROR", message: "Error calling OpenAI API.", httpStatus: 502 };
  }

  const responseMessage = completion.choices[0].message;
  if (!responseMessage) {
    return { type: "error", errorCode: "EMPTY_LLM_RESPONSE", message: "No response from LLM.", httpStatus: 502 };
  }

  // 🔁 Function call detected
  if (responseMessage.function_call) {
    let fnName = responseMessage.function_call.name;
    let fnArgs;
    try {
      fnArgs = JSON.parse(responseMessage.function_call.arguments);
    } catch (err) {
      console.error("Failed to parse function_call arguments:", err);
      return { type: "error", errorCode: "INVALID_FUNCTION_ARGS", message: "Malformed arguments for function call.", httpStatus: 400 };
    }

    let apiUrl;
    try {
      const encode = encodeURIComponent;
      switch (fnName) {
        case "getPermitDetails": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}`; break;
        case "getPermitStatus":
          apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/status?includeHistory=${!!fnArgs.includeHistory}`;
          break;
        case "searchPermitsByTaskName": apiUrl = `http://localhost:3000/permits/search/task?taskName=${encode(fnArgs.taskName)}`; break;
        case "getSafetyRequirements": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/safety`; break;
        case "getIsolationProcedures": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/isolation`; break;
        case "getContractorInfo": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/contractor`; break;
        case "getCompanyWorkers": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/workers`; break;
        case "getEmergencyProcedures": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/emergency`; break;
        case "getApprovers": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/approvers`; break;
        case "getPermitHistory": apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/history`; break;
        case "searchPermitsByRequester": apiUrl = `http://localhost:3000/permits/search/requester?requester=${encode(fnArgs.requester)}`; break;
        case "listActivePermitsByDepartment": apiUrl = `http://localhost:3000/permits/active/department/${encode(fnArgs.department)}`; break;
        default:
          return { type: "error", errorCode: "UNKNOWN_FUNCTION", message: `Unknown function ${fnName}`, httpStatus: 400 };
      }
    } catch (fnErr) {
      return fnErr?.errorCode
        ? fnErr
        : { type: "error", errorCode: "FUNCTION_PROCESS_ERROR", message: "Error preparing function call.", httpStatus: 500 };
    }

    // 🔄 Call downstream API
    let data;
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        return {
          type: "error",
          errorCode: "DOWNSTREAM_API_ERROR",
          message: `Permit service responded with ${res.statusText}`,
          httpStatus: res.status
        };
      }
      data = await res.json();
    } catch (err) {
      console.error("Downstream call failed:", err);
      return { type: "error", errorCode: "DOWNSTREAM_API_CALL_FAILED", message: "Failed to fetch data.", httpStatus: 502 };
    }

    // 🔁 Send back for LLM to explain the result
    conversation.push({ role: "function", name: fnName, content: JSON.stringify(data) });

    try {
      const secondCall = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: conversation,
      });

      const final = secondCall.choices[0].message;
      if (typeof final?.content === "string") return final.content;

      return { type: "error", errorCode: "EMPTY_FINAL_RESPONSE", message: "No final message from model.", httpStatus: 502 };
    } catch (err) {
      return { type: "error", errorCode: "SECOND_LLM_CALL_FAILED", message: "Failed during second response.", httpStatus: 502 };
    }
  }

  // Return direct LLM message if no function used
  return typeof responseMessage.content === "string"
    ? responseMessage.content
    : { type: "error", errorCode: "UNEXPECTED_LLM_FORMAT", message: "Unexpected response format.", httpStatus: 502 };
}
