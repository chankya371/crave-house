import express from "express";
import {
  createChat,
  getMessages,
  getAllChats,
} from "../controllers/chatController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);

router.get("/:chatId/messages", authMiddleware, getMessages);

router.get("/admin", authMiddleware, getAllChats);


export default router;