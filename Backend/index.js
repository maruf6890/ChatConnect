import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chatroom.routes.js";
import upload from "./routes/upload.routes.js"
import { Server } from "socket.io";
import Message from "./models/message.models.js";
import http from "http";
import ChatRoom from "./models/chatroom.models.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ roomId,image, message, senderId, type }) => {
    try {
      
      const savedMessage = await Message.create({
        chatRoom: roomId,
        content: image || message,
        sender: senderId,
        messageType: type,
      });

      //update room details
      await ChatRoom.findByIdAndUpdate(roomId,{lastMessage:message || "one image shared"});
      


      io.to(roomId).emit("receiveMessage", {
        id: savedMessage._id,
        sender: senderId,
        content: savedMessage.content,
        timestamp: savedMessage.timestamp,
        messageType: savedMessage.messageType,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB connection
connectDB();

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chatroom", chatRoute);
app.use("/api/v1/", upload);

// Test API
app.get("/", (req, res) => {
  res.send("Welcome to the Book Sharing Service API!");
});

//


// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
