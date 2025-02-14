import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { deepOrange } from '@mui/material/colors';
import React, { useContext } from 'react';
import { Typography, TextField, Button, Avatar, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Outlet, useNavigate } from 'react-router';
import './App.css';
import AuthContext from './Components/AuthProvider';
import axios from 'axios';

function App() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!currentUser) navigate('/login');

  const handleLogout = async () => {
    console.log(import.meta.env.VITE_API_BASE_URL);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/logout`, {}, { withCredentials: true });
      console.log("Logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      {/* Sidebar Menu with Icons Only */}
      <div className="w-full md:w-16 bg-gray-100 p-4 border-b md:border-b-0 md:border-r border-gray-300 flex md:flex-col items-center justify-between md:h-full">
        <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4">
          <Tooltip title={currentUser?.name} placement="right">
            <IconButton onClick={() => navigate('/app/profile')}>
              <Avatar
                src={currentUser.profilePicture}
                className="inline"
                sx={{ height: "32px", width: "32px", bgcolor: deepOrange[500] }}
                alt={currentUser?.name}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Start new chat" placement="right">
            <IconButton onClick={() => navigate('/app/new-chat')}>
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Friends" placement="right">
            <IconButton onClick={() => navigate('/app/friend-list')}>
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings" placement="right">
            <IconButton onClick={() => navigate('/app/profile')}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Tooltip title="Logout" placement="right">
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Chat Sidebar */}
      <div className="w-full md:w-72 bg-gray-100 p-4 border-r border-gray-300 hidden md:block">
        <div className='w-full text-blue-500'>Chat<b>Connect</b></div>
        <hr />

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
        </ul>
      </div>
      {/* Main Chat Window */}
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
