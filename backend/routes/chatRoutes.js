import express from "express";
import {
  createChat,
  getMessages,
} from "../controllers/chatController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);

router.get("/:chatId/messages", authMiddleware, getMessages);

export default router;