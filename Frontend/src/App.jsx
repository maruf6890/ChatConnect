import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { deepOrange } from '@mui/material/colors';
import React, { useContext, useEffect, useState } from 'react';
import { Typography, TextField, Button, Avatar, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Outlet,Link, useNavigate, useParams, useLocation } from 'react-router';
import './App.css';
import AuthContext from './Components/AuthProvider';
import axios from 'axios';
import { decryptData } from './pages/Utils/Encription';

function App() {
  const { currentUser } = useContext(AuthContext);
  const [searchQu, setSearchQu]= useState("");
  const navigate = useNavigate();
  const {roomId}=useParams();
  
  const [oldChat,setOldChat]= useState([]);
  const [tempChat,setTempChat]= useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
 
  if (!currentUser) navigate('/login');

  const handleLogout = async () => {
   
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/logout`, {}, { withCredentials: true });
      console.log("Logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSearchChat = (e) => {
    const value = e.target.value;
    setSearchQu(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    if (value === "") {
      setOldChat(tempChat); 
    } else {
      if (tempChat.length === 0) {
        setTempChat(oldChat); 
      }
  
      const newTimeout = setTimeout(async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}chatroom/search?query=${encodeURIComponent(value)}`,
            { withCredentials: true }
          );
          setOldChat(response.data.history);
        } catch (error) {
          console.log("Error fetching old messages:", error);
        }
      }, 500);
  
      setDebounceTimeout(newTimeout);
    }
  };
  
 
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  
  useEffect(() => {
    const handleFetchingData = async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}chatroom/old`,
          { withCredentials: true }
        );
        setOldChat(data.data.history);
       
      } catch (error) {
        
      }
    };
    handleFetchingData(); // Call the function to fetch data
  }, [currentUser]); //


  
  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      {/* Sidebar Menu with Icons Only */}
      <div className="w-full md:w-16 bg-gray-100 p-4 border-b md:border-b-0 md:border-r border-gray-300 flex md:flex-col items-center justify-between md:h-full">
        <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4">
          <Tooltip title={currentUser?.name} placement="right">
            <IconButton onClick={() => navigate('/app/profile')}>
              <Avatar
                src={currentUser?.profilePicture}
                className="inline"
                sx={{ height: "32px", width: "32px",  }}
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
              name='chat'
              variant="outlined"
              placeholder="Search Chat..."
              size="small"
              onChange={handleSearchChat}
              className="mb-4"
            />
          </div>

          <Typography className="flex gap-2" variant="h6" gutterBottom>
            Chats History
          </Typography>

          {oldChat.map((contact) => (
  <Link
    key={contact._id}
    to={`/app/private-chat/${contact._id}`}
    className="p-2 rounded hover:bg-gray-200 cursor-pointer block"
  >
    <div className="card flex gap-2 items-center">
      <Avatar
        src={(contact.participants[0].email === currentUser?.email) ? contact.participants[1].profilePicture : contact.participants[0].profilePicture}
        className="inline"
        sx={{ height: "40px", width: "40px",  }}
        alt={(contact.participants[0].email === currentUser?.email) ? contact.participants[1].name : contact.participants[0].name}
      
      />
      <div>
        <p className="font-semibold">
          {(contact.participants[0].email === currentUser?.email) ? contact.participants[1].name : contact.participants[0].name}
        </p>
        <p className="text-sm text-gray-500">
          {(contact.participants[0].email === currentUser?.email) ? contact.participants[1].email : contact.participants[0].email}
        </p>
        <p className="text-xs text-gray-500">
             {/*roomId? roomId===contact._id? 'Chatting...' : (decryptData(contact.lastMessage).length>20)?decryptData(contact.lastMessage).slice(0,20)+'...':decryptData(contact.lastMessage).slice(0,20) :  (decryptData(contact.lastMessage).length>20)?decryptData(contact.lastMessage).slice(0,20)+'...':decryptData(contact.lastMessage).slice(0,20)*/}
        
       </p>

      </div>
    </div>
  </Link>
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
