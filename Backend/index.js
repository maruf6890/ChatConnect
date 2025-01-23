import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js"; // Import the user route
import chatRoute from "./routes/chatroom.routes.js";
import { Server } from 'socket.io';
import Message from "./models/message.models.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const server= http.createServer(app);
const io= new Server(server,{
  cors: {
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST'],
}});





// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(
  cors({
    origin: 'http://localhost:5173', // Specify the frontend's origin explicitly
    credentials: true, // Allow cookies and credentials
  })
);




// mantain socket io
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  //
  socket.on("sendMessage", async ({ roomId, message, senderId ,type}) => {
    const message= Message.create({ chatRoom: roomId, content: message, sender: senderId, messageType: type });
    io.to(roomId).emit("receiveMessage", 
      {
        id: message._id,
        sender: senderId,
        content: message.content,
        timestamp: message.timestamp,
        messageType: message.messageType,
      }
  );


  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.use(cookieParser());

// MongoDB connection
connectDB();

// Route setup
app.use("/api/v1/user", userRoute); // Mount user routes



//chatroom router
app.use("/api/v1/chatroom",chatRoute);
// Test API
app.get("/", (req, res) => {
  res.send("Welcome to the Book Sharing Service API!");
});
// realtine search bar 


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
