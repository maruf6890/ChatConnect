import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import WelcomePage from './pages/Welcome';
import Login from './pages/Login';
import Registration from './pages/Regtisration';
import App from './App';
import { AuthProvider } from './Components/AuthProvider';
import NewChat from './pages/NewChat';
import ChatHomePage from './pages/ChatHomePage';
import PrivateChatRoom from './pages/PrivateChatRoom';
import Profile from './pages/Profile';
import FriendList from './pages/Friendlist';
import BlockList from './pages/BlockList';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(


<AuthProvider>
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<WelcomePage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registration" element={<Registration />} />

    {/* App Layout with Nested Routes */}
    <Route path="/app" element={<App />}>
      <Route index element={<ChatHomePage />} /> {/* Default Outlet */}
      <Route path="/app/new-chat" element={<NewChat />} /> {/* Nested Route */}
      <Route path="/app/profile" element={<Profile/>} />
      <Route path="/app/friend-list" element={<FriendList/>} />
      <Route path="/app/block-list" element={<BlockList></BlockList>} />
      <Route path="/app/private-chat/:roomId" element={<PrivateChatRoom />} /> {/* Nested Route */}  
    </Route>
  </Routes>
</BrowserRouter>
</AuthProvider>

);
