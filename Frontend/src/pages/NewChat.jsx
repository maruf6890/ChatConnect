import React, { useContext, useState } from "react";
import { Box, Typography, TextField, Avatar, IconButton } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import AuthContext from '../Components/AuthProvider';
import { useNavigate } from "react-router";
// Dummy Contact Data
const contacts = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    avatar: "",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    avatar: "",
  },
];

const NewChat = () => {
  const {currentUser}=useContext(AuthContext);

  const navigate= useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const   [filteredContacts, setFilteredContacts] = useState([]);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log(e.target.value);
    const fetchData=async()=>{
      try {
       const res = await axios.get(`http://localhost:3000/api/v1/user/search`,{params:{query:e.target.value}});
        setFilteredContacts(res.data);
      } catch (error) {
          console.log(error.response.data);
      }
    }
    fetchData();
  }


  //const  join chat 
  const handleJoinChat = (id) => {
    console.log("join chat",id);
    const joinChat=async()=>{
      try {
       const res = await axios.post(`http://localhost:3000/api/v1/chatroom/join`,{user1:currentUser._id,user2:id,type:"private"},{withCredentials:true});
        if(res && res.data){
          console.log(res.data);
          navigate(`/app/private-chat/${res.data.id}`);
        }
      } catch (error) {
          console.log(error.response.data);
      }
    }
    joinChat();
  }

  // add to firend 

  const handleAddFriend = (id) => {
    console.log(id);

    const addFriend = async () => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/v1/user/add',
                { userId: currentUser?._id, friendId: id },
                { withCredentials: true }
            );
            if (res && res.data) {
                console.log(res.data);
            } else {
                console.log("No response data");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.log(error.response.data);
            } else {
                console.log("Error:", error.message);
            }
        }
    };

    addFriend();
};


  // Filter contacts based on search query
  
  return (
    <Box
      className="w-full h-screen"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        height: "100vh",
        p: 3,
        bgcolor: "gray.100",
      }}
    >
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        New Conversation
      </Typography>

      {/* Search Bar */}
      <TextField

        label="Search Contacts"
        variant="outlined"
        fullWidth
        sx={{ maxWidth: 400, my: 2 }}
        value={searchQuery}
        onChange={handleSearch}
      />

      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Box
              key={contact.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 1,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: deepOrange[500],
                  }}
                >
                  {contact.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1">{contact.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {contact.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => handleAddFriend(contact._id)} color="primary">
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => handleJoinChat(contact._id)} color="secondary">
                  <ChatIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No contacts found.
          </Typography>
        )}
     
       
      </Box>
    </Box>
  );
};

export default NewChat;
