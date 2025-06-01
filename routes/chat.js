import express from "express";
import { chatController, chatRateLimiter } from "../controllers/chatController.js";

const router = express.Router();

// Apply rate limiting middleware to /api/chat
router.post("/", chatRateLimiter, (req, res) => chatController.handleUserMessage(req, res));

export default router;