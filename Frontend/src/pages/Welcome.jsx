import React from "react";
import { Link } from "react-router";
import { Button,Typography,Box } from "@mui/material";
import "tailwindcss/tailwind.css";


const WelcomePage = () => {
  console.log(import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      {/* Header */}
      <header className="bg-white py-4 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Typography variant="h5" className="font-bold text-gray-800">
            ChatConnect
          </Typography>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center">
        <Box className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl text-center">
          <Typography variant="h3" className="text-gray-800 font-extrabold text-4xl mb-4">
            Welcome to ChatConnect
          </Typography>
          <Typography variant="body1" className="text-gray-600 text-lg mb-8">
            A place to connect, chat, and share moments with your friends and the world.
          </Typography>
          <div className="w-full space-y-4">
            {/* Log In Button */}
            <Link
              to="/login"
              className="block w-full py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white text-center transition-all duration-300 transform hover:bg-blue-700 hover:scale-105"
            >
              Log In
            </Link>
            
            {/* Sign Up Button */}
            <Link
              to="/registration"
              className="block w-full py-3 text-lg font-semibold rounded-lg border-2 border-blue-600 text-blue-600 text-center transition-all duration-300 transform hover:bg-blue-100 hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </Box>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto text-center">
          <Typography variant="body2" className="text-gray-400">
            © 2025 ChatConnect. All rights reserved.
          </Typography>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
