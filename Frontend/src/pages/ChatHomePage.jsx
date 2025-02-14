import React from "react";
import ChatIcon from "@mui/icons-material/Chat";

const ChatHomePage = () => {
  return (
    <div className="flex w-full items-center justify-center h-screen bg-blue-50">
      <div className="text-center p-6 ">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <ChatIcon style={{ fontSize: "4rem", color: "#007BFF" }} /> 
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-blue-800">ChatApp for Web</h1>

        {/* Subtitle */}
        <p className="text-blue-600 mt-4">
          Send and receive messages without keeping your phone online.
        </p>
        <p className="text-blue-600">
          Use ChatApp on up to <strong>4 linked devices</strong> and 1 phone at the same time.
        </p>
      </div>
    </div>
  );
};

export default ChatHomePage;
