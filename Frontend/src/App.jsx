import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { deepOrange } from '@mui/material/colors';
import React, { useContext } from 'react';
import { Typography, TextField, Button, Avatar } from '@mui/material';
import { Outlet, useNavigate } from 'react-router';
import './App.css';
import AuthContext from './Components/AuthProvider';
import axios from 'axios';

function App() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/user/logout", {}, { withCredentials: true });
      console.log("Logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const startNewChat = () => {
    navigate("/new-chat");
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-100 p-4 border-r border-gray-300">
        <Typography className="flex gap-2" variant="h6" gutterBottom>
          <Avatar
            className="inline mt-2"
            sx={{ bgcolor: deepOrange[500] }}
            alt={currentUser?.name}
          />
          <div>
            {currentUser?.name || "Guest"}
            <p className="text-xs text-gray-600">{currentUser?.email}</p>
          </div>
        </Typography>

        <ul className="space-y-2">
          <div className="mt-5">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Chat..."
              size="small"
              className="mb-4"
            />
          </div>

          <Typography className="flex gap-2" variant="h6" gutterBottom>
            Chats History
          </Typography>

          {["John Doe", "Jane Smith", "Alice Johnson"].map((contact) => (
            <li
              key={contact}
              className="p-2 rounded hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate(`/chat/${contact}`)}
            >
              {contact}
            </li>
          ))}

          {/* Add New Conversation */}
          
        </ul>

        <div className="cursor-pointer  text-red-600">
        <Button style={{marginBottom: "10px"}} variant="contained" color="primary" fullWidth className="mb-10" onClick={() => navigate('/app/new-chat')} > New Conversation </Button> 
        <Button variant="contained" color="primary" fullWidth onClick={handleLogout} > Logout </Button>
        </div>
        
      </div>

      {/* Main Chat Window */}
      <Outlet />
    </div>
  );
}

export default App;
