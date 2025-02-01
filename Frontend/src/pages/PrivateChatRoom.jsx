import { 
  Button, CircularProgress, TextField, Typography 
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import AuthContext from "../Components/AuthProvider";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { styled } from "@mui/material/styles";

// Initialize Socket.IO
const socket = io("http://localhost:3000", { autoConnect: false });

export default function PrivateChatRoom() {
  const { roomId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [chatroom, setChatroom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState({});
  const [other, setOther] = useState({});
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null); // Auto-scroll reference

  // Hidden File Input
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Fetch chatroom data
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/chatroom/${roomId}`);
        setChatroom(response.data);

        if (response.data.participants[0]._id === currentUser._id) {
          setMe(response.data.participants[0]);
          setOther(response.data.participants[1]);
        } else {
          setMe(response.data.participants[1]);
          setOther(response.data.participants[0]);
        }
      } catch (error) {
        console.error("Error fetching chatroom:", error);
      }
    };
    joinRoom();
  }, [roomId]);

  // Handle socket connection and join room
  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    socket.emit("joinRoom", roomId);

    const handleMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.disconnect();
    };
  }, [roomId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Image Upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log(file);

    // Check file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;

      console.log("Image URL:", imageUrl);
      // Send image message
      
      socket.emit("sendMessage", {
        roomId,
        senderId: currentUser._id,
        image: imageUrl,
        type: "image",
      });

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image!");
    } finally {
      setUploading(false);
    }
  };

  // Send Text Message
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        roomId,
        message,
        senderId: currentUser._id,
        type: "text",
      };

      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <Typography variant="h6">{other.name || "Chat Room"}</Typography>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === me._id ? "flex justify-end" : ""}>
          {console.log(msg)}
            <div
              className={`mb-4 ${
                msg.sender === me._id
                  ? "bg-white border border-gray-400 rounded-md shadow-sm p-4 w-6/12 text-start"
                  : "bg-blue-200 rounded-md shadow-sm p-4 w-6/12 text-start"
              }`}
            >
              <Typography variant="body2" className="text-gray-500">
                {msg.sender === me._id ? me.name : other.name}
              </Typography>

              {msg.messageType === "image" ? (
                <img src={msg.content} alt="Uploaded" className="rounded-lg max-w-xs mt-2" />
              ) : (
                <Typography variant="body1">{msg.content}</Typography>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 border-t border-gray-300 bg-white">
        {/* Image Upload */}
        <Button variant="contained" color="primary" component="label" disabled={uploading}>
          {uploading ? <CircularProgress size={20} color="inherit" /> : <AttachmentIcon />}
          <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
        </Button>

        {/* Text Input */}
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mx-2"
        />

        {/* Send Button */}
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
