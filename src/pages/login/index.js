import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import BASE_URL from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post(`${BASE_URL}/api/login`, { 
        email,
        password,
      });

      const { token } = response.data; 
      localStorage.setItem("authToken", token); 

      console.log("Login Successful:", response.data);
      alert("Login Successful!");

      navigate("/users"); 
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Invalid credentials, please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1 }}
            type="submit"
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
