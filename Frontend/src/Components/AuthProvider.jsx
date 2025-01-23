import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Indicates whether authentication data is being loaded
  const API_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is set correctly in your .env file

  // Fetch the current user from the server
  const updateCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}user/current-user`, {
        withCredentials: true, // Ensure cookies are included
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      setCurrentUser(null); // Clear user data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch the current user on initial load
  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, updateCurrentUser }}>
      {!loading ? children : <div>Loading...</div>} {/* Show a loading indicator */}
    </AuthContext.Provider>
  );
};

// Custom Hook for AuthContext
export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
