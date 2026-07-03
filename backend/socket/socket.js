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
      attachment = "",
      messageType = "text",
    } = data;

    const newMessage = await Message.create({
      chat: chatId,
      sender: senderId,
      senderType: sender,
      message: text || "",
      attachment,
      messageType,
    });

    const chat = await Chat.findById(chatId);

    if (!chat) return;

    // Last message preview
    let lastMsg = text;

    if (messageType === "image") {
      lastMsg = text ? "📷 " + text : "📷 Image";
    }

    if (messageType === "file") {
      lastMsg = "📎 File";
    }

    chat.lastMessage = lastMsg;
    chat.lastMessageTime = new Date();

    if (sender === "customer") {
      chat.unreadCount += 1;
    } else {
      chat.unreadCount = 0;

      if (!chat.admin) {
        chat.admin = senderId;
      }
    }

    await chat.save();

   const payload = {
    id: newMessage._id,
    chatId,
    sender,
    senderId,
    text: newMessage.message,
    attachment: newMessage.attachment,
    messageType: newMessage.messageType,
    time: newMessage.createdAt,
};

io.to(chatId).emit("receive_message", payload);

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