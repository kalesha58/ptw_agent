import OpenAI from "openai";
import dotenv from "dotenv";
import { functions } from "./fuctions.js";
const fetch = (await import("node-fetch")).default;

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Main function to be exported
export async function chatLoop(userMessage) {
  const conversation = [
    {
      role: "system",
      content: `You are PTW Sentinel—an intelligent AI assistant for a digital Permit to Work system.`
    },
    { role: "user", content: userMessage }
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: conversation,
    functions,
    function_call: "auto"
  });

  const responseMessage = completion.choices[0].message;

  if (responseMessage.function_call) {
    const fnName = responseMessage.function_call.name;
    const fnArgs = JSON.parse(responseMessage.function_call.arguments);
    let apiUrl = "";

    switch (fnName) {
      case "getPermitDetails":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}`;
        break;
      case "getPermitStatus":
        const queryParams = fnArgs.includeHistory
          ? "?includeHistory=true"
          : "?includeHistory=false";
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/status${queryParams}`;
        break;
      case "searchPermitsByTaskName":
        apiUrl = `http://localhost:3000/permits/search/task?taskName=${encodeURIComponent(fnArgs.taskName)}`;
        break;
      case "getSafetyRequirements":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/safety`;
        break;
      case "getIsolationProcedures":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/isolation`;
        break;
      case "getContractorInfo":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/contractor`;
        break;
      case "getCompanyWorkers":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/workers`;
        break;
      case "getEmergencyProcedures":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/emergency`;
        break;
      case "getApprovers":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/approvers`;
        break;
      case "getPermitHistory":
        apiUrl = `http://localhost:3000/permits/${fnArgs.permitId}/history`;
        break;
      case "searchPermitsByRequester":
        apiUrl = `http://localhost:3000/permits/search/requester?requester=${encodeURIComponent(fnArgs.requester)}`;
        break;
      case "listActivePermitsByDepartment":
        apiUrl = `http://localhost:3000/permits/active/department/${encodeURIComponent(fnArgs.department)}`;
        break;
      default:
        return `Error: Unknown function ${fnName}`;
    }

    const apiResponse = await fetch(apiUrl);
    const json = await apiResponse.json();

    conversation.push({
      role: "function",
      name: fnName,
      content: JSON.stringify(json)
    });

    const secondCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversation
    });

    return secondCompletion.choices[0].message.content;
  } else {
    return responseMessage.content;
  }
}
