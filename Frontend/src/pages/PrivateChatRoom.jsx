import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import AuthContext from "../Components/AuthProvider";


const socket = io("http://localhost:3000", { autoConnect: false }); // Ensure socket is not auto-connected

export default function PrivateChatRoom() {
  const { roomId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [chatroom, setChatroom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState({});
  const [other,setOther]=useState({});

  // Fetch chatroom data
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/chatroom/${roomId}`);
        setChatroom(response.data);
        console.log("Chatroom data:", response.data);
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

    socket.connect(); // Connect only when the component mounts
    socket.emit("joinRoom", roomId);

    const handleMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage); 
    };
  }, [roomId]);

  // Send message
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
        <Typography variant="h6">
          {other.name || "Chat Room"}
        </Typography>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === me._id ? "flex justify-end" : ""}>
            <div
              className={`mb-4 ${
                msg.sender=== me._id
                  ? "bg-white border border-gray-400 rounded-md shadow-sm p-6 w-6/12 text-start"
                  : "bg-blue-200 rounded-md shadow-sm p-6 w-6/12 text-start"
              }`}
            >

              {console.log("message:",msg)}
              <Typography variant="body2" className="text-gray-500">
                {msg.sender === me._id ? me.name : other.name}
              </Typography>
              <Typography variant="body1">{msg.content}</Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 border-t border-gray-300 bg-white">
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mr-2"
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
