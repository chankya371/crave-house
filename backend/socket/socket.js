import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

let io;

export const initSocket = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // User personal room
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined room`);
    });

    // Chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`💬 Joined Chat Room: ${chatId}`);
    });

    // Send Message
    socket.on("send_message", async (data) => {
      try {
        const {
          chatId,
          senderId,
          sender,
          text,
        } = data;

        // Save message
        const newMessage = await Message.create({
          chat: chatId,
          sender: senderId,
          senderType: sender,
          message: text,
        });

        // Get current chat
        const chat = await Chat.findById(chatId);

        if (!chat) return;

        // Customer message
        if (sender === "customer") {
          chat.lastMessage = text;
          chat.lastMessageTime = new Date();
          chat.unreadCount += 1;
        }

        // Admin message
        if (sender === "admin") {
          chat.lastMessage = text;
          chat.lastMessageTime = new Date();
          chat.unreadCount = 0;

          if (!chat.admin) {
            chat.admin = senderId;
          }
        }

        await chat.save();

        // Send realtime message
        io.to(chatId).emit("receive_message", {
          id: newMessage._id,
          chatId,
          sender,
          senderId,
          text: newMessage.message,
          time: newMessage.createdAt,
        });

        console.log("📨 Message Saved:", newMessage._id);

      } catch (err) {
        console.error("❌ Socket Error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;