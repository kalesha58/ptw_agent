import { chatLoop } from "../agent.js";  // note: agent.js chatLoop has improved error handling
import { formatterService } from "./formatterService.js";

export const ptwService = {
  async processUserMessage(userMessage) {
    try {
      const rawReply = await chatLoop(userMessage);

      // If chatLoop returns a structured error object, propagate it
      if (rawReply && rawReply.type === "error") {
        return rawReply; // { type: "error", errorCode: "...", message: "...", httpStatus: XXX }
      }

      // Attempt to format as Markdown if applicable
      const markdown = formatterService.formatAsMarkdownIfNeeded(rawReply);
      if (markdown !== null) {
        return { type: "markdown", content: markdown };
      }

      // Otherwise, return as plain string
      // If rawReply is an object that's not a full permit, stringify
      if (typeof rawReply === "object") {
        return { type: "plain", content: JSON.stringify(rawReply, null, 2) };
      }
      return { type: "plain", content: rawReply };
    } catch (err) {
      console.error("Error in ptwService.processUserMessage:", err);
      // If the error already has structured properties, return them
      if (err && err.errorCode && err.message) {
        return { type: "error", errorCode: err.errorCode, message: err.message, httpStatus: err.httpStatus || 500 };
      }
      // Fallback: generic error
      return { type: "error", errorCode: "PTW_SERVICE_ERROR", message: "Failed to process message." };
    }
  },
};
