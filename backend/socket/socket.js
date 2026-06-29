let io;

export const initSocket = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined room user_${userId}`);
  });

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send_message", (data) => {
    io.to(data.chatId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});
};

export const getIO = () => io;