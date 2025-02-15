import {
  Avatar,
  Button, CircularProgress, TextField, Typography
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import AuthContext from "../Components/AuthProvider";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { styled } from "@mui/material/styles";
import { decryptData, encryptData } from "./Utils/Encription";
import ProfileDropdown from "./ProfileDropdown";

// Initialize Socket.IO
const socket = io(`${import.meta.env.VITE_BACKEND}`, { autoConnect: false });

export default function PrivateChatRoom() {
  const { roomId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [chatroom, setChatroom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [me, setMe] = useState({});
  const [other, setOther] = useState({});
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null); // Auto-scroll reference
  const [loading,setLoading]= useState(false);

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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}chatroom/${roomId}`);
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


 const fetchMessageOnScroll = async (pageNumber) => {
    setMessage([]);
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}chatroom/messages/${roomId}?page=${pageNumber}&limit=20`);
      if(res.data.messages<20){
        setHasMore(false);
      }
      res.data.messages.reverse();
    
      setMessages(res.data.messages);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Error fetching messages");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageOnScroll(1);
  }, [roomId]);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      
      fetchMessageOnScroll(nextPage);
    }
  };
console.log("page:", page);
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;


      // Send image message
      const encrptedMessage = encryptData(imageUrl);

      socket.emit("sendMessage", {
        roomId,
        senderId: currentUser._id,
        image: encrptedMessage,
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

    const encrptedMessage = encryptData(message);


    if (message.trim()) {
      const newMessage = {
        roomId,
        message: encrptedMessage,
        senderId: currentUser._id,
        type: "text",
      };

      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };



  useEffect(() => {
    const fetchMessages = async () => {
      try {
       
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [])
  if (loading) {
    return <div className="w-full h-screen">Loading...</div>; 
  }
  return (
 
      <div className="flex flex-col w-full flex-1">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center border-gray-300 bg-white">
          <ProfileDropdown other={other} />
          <Typography variant="h6">{other.name || "Chat Room"}</Typography>
        </div>
  
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === me._id ? "flex justify-end" : ""}>
          
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
                  <img src={decryptData(msg.content)} alt="Uploaded" className="rounded-lg max-w-xs mt-2" />
                ) : (
                  <Typography variant="body1">{decryptData(msg.content)}</Typography>
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