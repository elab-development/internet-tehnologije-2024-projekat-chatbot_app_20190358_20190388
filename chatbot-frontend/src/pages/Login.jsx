import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Typography } from "@mui/material";
import Button from "../components/Button"; // Reusable Button Component

const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      const { id, role, name } = data.user;
      const { token } = data;

      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userToken", token);

      alert("Welcome to Aurora AI!");

      navigate(role === "admin" ? "/dashboard" : "/home");
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top, #1a1a2e, #16213e, #0f3460)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          padding: 4,
          width: "400px",
          background: "rgba(0, 0, 0, 0.75)",
          color: "#fff",
          textAlign: "center",
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Logo and Title */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <img
            src="/assets/logo.png"
            alt="Aurora AI Logo"
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Aurora AI
          </Typography>
        </Box>

        <Typography variant="subtitle1" color="gray" mb={3}>
          Artificial intelligence of the future.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <Button 
            text="Log in"
            type="submit"
            onClick={handleSubmit}
            loadingPosition="start"
            sx={{ mt: 3, width: "100%" }}
          />
        </form>

        <Typography variant="body2" mt={3}>
          Don't have an account?{" "}
          <Button
            text="Register here"
            onClick={() => navigate("/register")}
            variant="text"
            color="secondary"
          />
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
