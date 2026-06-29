import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import routes from "./routes/routes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import { initSocket } from "./socket/socket.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/location", locationRoutes);
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => console.log("DB Connected"))
  .catch((error) => console.error("Mongo Error:", error));

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("🔥 Live Reload Test 2");