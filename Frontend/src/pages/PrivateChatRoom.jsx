import { Button, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

export default function PrivateChatRoom() {
  const { roomId } = useParams();
  const [chatroom, setChatroom] = useState(null);  // Store chatroom data
  const [message, setMessage] = useState('');      // Store current input message
  const [messages, setMessages] = useState([]);    // Store chat messages
  
  // Fetch the chatroom data on component mount
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/chatroom/${roomId}`);
        setChatroom(response.data);
        console.log(response.data);
       
      } catch (error) {
        console.error('Error joining room:', error);
      }
    };
    joinRoom();
  }, [roomId]);

  // Handle message sending
  const sendMessage = async () => {
    console.log(message);
  };

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <Typography variant="h6">{chatroom?.participants[1].name}</Typography>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'You' ? 'measage flex justify-end' : ''}>
            <div className={`mb-4 ${msg.sender === 'You' ? 'bg-white border border-gray-400 rounded-md shadow-sm p-6 w-6/12 text-start' : ''}`}>
              <Typography variant="body2" className="text-gray-500">
                {msg.sender}
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
