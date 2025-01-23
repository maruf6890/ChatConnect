import { TextField, Button, Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Components/AuthProvider";
import axios from "axios";

export default function Registration() {
  const { register } = useContext(AuthContext);
  const [dummyData, setDummyData] = useState("Ami");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

 
   

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/`);
        setDummyData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDummyData("Error fetching data");
      }
    };

    fetchData();
  }, []);

  console.log("Dummy Data:", dummyData);

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
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} type="submit">
            Sign Up
          </Button>
        </form>
      </Box>
    </div>
  );
}
