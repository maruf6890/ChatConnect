import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Components/AuthProvider";
import axios from "axios";

export default function Registration() {
  const { register } = useContext(AuthContext);
  const [dummyData, setDummyData] = useState("Ami");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/registration`, data);
      setResponseMessage("Registration successful!");
      // You can also call register() here if it's part of the AuthContext.
    } catch (error) {
      setResponseMessage("Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box sx={{ width: "100%", maxWidth: 400, padding: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
          Sign Up for ChatConnect
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="User Name"
            type="text"
            fullWidth
            margin="normal"
            required
          />
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
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>
        {responseMessage && (
          <Typography sx={{ textAlign: "center", marginTop: 2, color: loading ? "black" : "red" }}>
            {responseMessage}
          </Typography>
        )}
      </Box>
    </div>
  );
}
