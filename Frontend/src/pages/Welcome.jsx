import React from "react";
import { Link } from "react-router";
import { Button,Typography,Box,AppBar,Toolbar } from "@mui/material";
import "tailwindcss/tailwind.css";


const WelcomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <AppBar position="static"  sx={{ backgroundColor: "#fff", boxShadow: "none" }}  className="shadow-md">
        <Toolbar className="max-w-7xl mx-auto flex justify-between w-full">
          <Typography variant="h4" className="font-bold text-blue-500">
            Chat<b className="text-blue-600">Connect</b>
           
          </Typography>
          <Link to="/registration" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col-reverse md:flex-row items-center justify-center px-6 py-10 md:py-20">
      <Box className="max-w-2xl text-start p-20">
          <Typography variant="h4" className="text-gray-900 font-extrabold text-3xl md:text-5xl mb-6">
            Start chatting with your connects, anytime, anywhere with ChatConnect
          </Typography>
          <Typography variant="body1" className="text-gray-600 text-lg mb-8">
            Great software that allows you to chat from any place at any time without any interruption.
          </Typography>
          <Link to="/login">
            <Button 
              variant="contained" 
              sx={{ backgroundColor:"none", color: "#fff",marginTop:"10px", padding: "12px 24px", fontSize: "1.2rem", borderRadius: "8px" }}
              className="flex items-center  bg-blue-500 space-x-2 shadow-md transition-all duration-300 transform hover:scale-105">
              Start Chatting Now →
            </Button>
          </Link>
        </Box>
        <Box className="w-full md:w-1/2 flex justify-center">
          <img src="./chat.png" className="w-64 md:w-96" alt="Chat Illustration" />
        </Box>
      </div>

      {/* Footer */}
      <footer className="bg-white text-white py-4 text-center">
        <Typography variant="body2" className="text-gray-400">
          © 2025 ChatConnect. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default WelcomePage;

