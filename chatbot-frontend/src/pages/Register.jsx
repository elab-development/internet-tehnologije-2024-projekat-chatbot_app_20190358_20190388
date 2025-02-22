import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Typography } from "@mui/material";
import Button from "../components/Button"; // Reusable MUI Button

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

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
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during registration.");
      }

      alert("Welcome to Aurora AI! Redirecting to login.");
      navigate("/");
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
          Join the future of artificial intelligence.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            required
          />

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
            required
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
            required
          />

          <Button 
            text="Register"
            type="submit"
            onClick={handleSubmit}
            loadingPosition="start"
            sx={{ mt: 3, width: "100%" }}
          />
        </form>

        <Typography variant="body2" mt={3}>
          Already have an account?{" "}
          <Button
            text="Log in"
            onClick={() => navigate("/")}
            variant="text"
            color="secondary"
          />
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
