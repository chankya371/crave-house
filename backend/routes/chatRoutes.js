import express from "express";
import {
  createChat,
  getMessages,
  getAllChats,
  uploadChatImage,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadChat from "../middleware/uploadChat.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);

router.post(
  "/upload",
  authMiddleware,
  uploadChat.single("image"),
  uploadChatImage
);

router.get("/admin", authMiddleware, getAllChats);

router.get("/:chatId/messages", authMiddleware, getMessages);

export default router;