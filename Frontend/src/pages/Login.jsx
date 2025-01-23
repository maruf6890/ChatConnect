import { TextField, Button, Box, Typography } from "@mui/material";
import { useContext, useState } from "react";
import AuthContext from "../Components/AuthProvider"; // Ensure this is correctly imported
import { useNavigate } from "react-router";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext); // To set user context globally
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is set correctly in .env file

  const handleLogin = async (event) => {
    setResponseMessage("");
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true);

      // Sending credentials to the server
      const response = await axios.post(`${API_URL}user/login`,{
        email,
        password,
      },{withCredentials: true});
      
      if (response.data.success) {
        const { user } = response.data;

        // Update the user context
        setCurrentUser(user);

        navigate("/app");
      }

      setResponseMessage(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred.";
      setResponseMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <Typography variant="h6" className="text-start mb-4">
          Login to ChatConnect
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        {responseMessage && (
          <Typography
            variant="body2"
            style={{
              color: responseMessage.startsWith("Error") ? "red" : "green",
              marginTop: "10px",
            }}
          >
            {responseMessage}
          </Typography>
        )}
      </Box>
    </div>
  );
}
