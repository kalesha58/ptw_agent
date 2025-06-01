import { permitToMarkdown } from "../helper/function_markdown_format.js";

export const formatterService = {
  /**
   * If reply is a full permit object (with expected fields), returns Markdown string.
   * Otherwise, if reply is a string but matches structured pattern, returns it as-is.
   * Else, returns null.
   */
  formatAsMarkdownIfNeeded(reply) {
    if (reply && typeof reply === "object") {
      const { taskName, safetyRequirements, startDateTime, endDateTime } = reply;
      if (taskName && safetyRequirements && startDateTime && endDateTime) {
        // Generate Markdown from object
        return permitToMarkdown(reply);
      }
      return null;
    }

    if (typeof reply === "string") {
      // If the string contains key phrases, treat it as already formatted content
      const pattern = /Task Name:|Requester:|Start Date/i;
      if (pattern.test(reply)) {
        return reply;
      }
      return null;
    }

    return null;
  },

}
