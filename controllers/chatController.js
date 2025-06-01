import { ptwService } from "../services/ptwService.js";

// Rate limiter using express-rate-limit
import rateLimit from "express-rate-limit";

// Configure rate limiter: e.g., max 30 requests per minute per IP
export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { errorCode: "RATE_LIMIT_EXCEEDED", message: "Too many requests, please try again later." },
});

export const chatController = {
  async handleUserMessage(req, res) {
    // Validate that req.body.message exists and is a non-empty string
    const { message } = req.body;
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ errorCode: "INVALID_INPUT", message: "`message` must be a non-empty string." });
    }

    try {
      const result = await ptwService.processUserMessage(message);

      switch (result.type) {
        case "markdown":
          // Send as Markdown (Content-Type defaults to text/html for Markdown if desired)
          return res.setHeader("Content-Type", "text/markdown").send(result.content);
        case "plain":
          return res.send(result.content);
        case "error":
          // Structured error returned from service
          // Map errorCode to appropriate HTTP status if needed
          const status = result.httpStatus || 500;
          return res.status(status).json({ errorCode: result.errorCode, message: result.message });
        default:
          // Fallback: send plain content
          return res.send(result.content || "");
      }
    } catch (err) {
      console.error("Unexpected error in handleUserMessage:", err);
      return res.status(500).json({ errorCode: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." });
    }
  },
};
