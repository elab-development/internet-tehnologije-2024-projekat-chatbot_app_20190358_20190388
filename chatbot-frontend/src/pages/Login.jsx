import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import Button from "../components/Button"; // Reusable Button Component

const API_BASE = "http://127.0.0.1:8000/api";

const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Reset modal state
  const [resetOpen, setResetOpen] = useState(false);
  const [resetForm, setResetForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetErr, setResetErr] = useState("");
  const [resetOk, setResetOk] = useState("");

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
      const response = await fetch(`${API_BASE}/login`, {
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

      // Extract user data
      const { id, user_role, name, subscription_id } = data.user;
      const { token } = data;

      // Update sessionStorage
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userRole", user_role);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userToken", token);
      sessionStorage.setItem("subscription_id", subscription_id);

      // Update the React state
      setUserData({ id, user_role, name, token });

      alert("Welcome to Aurora AI!");
      const isAdmin = user_role === "admin";
      if (isAdmin) {
        window.location.replace("/admin-dashboard");
      } else {
        window.location.replace("/home");
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  // ------- Reset password modal handlers -------
  const openReset = () => {
    setResetErr("");
    setResetOk("");
    setResetForm({ email: formData.email || "", password: "", confirm: "" });
    setResetOpen(true);
  };

  const closeReset = () => {
    if (!resetLoading) setResetOpen(false);
  };

  const submitReset = async () => {
    setResetErr("");
    setResetOk("");

    const email = resetForm.email.trim();
    const pwd = resetForm.password.trim();
    const confirm = resetForm.confirm.trim();

    if (!email) {
      setResetErr("Email is required.");
      return;
    }
    if (!pwd || pwd.length < 8) {
      setResetErr("Password must be at least 8 characters.");
      return;
    }
    if (pwd !== confirm) {
      setResetErr("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, set_password: pwd }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          json?.message || json?.error || `Reset failed (${res.status}).`
        );
      }

      setResetOk(json?.message || "Your password has been reset.");
      // Prefill login with that email
      setFormData((prev) => ({ ...prev, email }));
      // Auto-close after a short moment
      setTimeout(() => setResetOpen(false), 1200);
    } catch (e) {
      setResetErr(e.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
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

          {/* Forgot password link-like question */}
          <Typography
            component="button"
            type="button"
            onClick={openReset}
            sx={{
              mt: 1,
              mb: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f093fb",
              fontWeight: 600,
              textDecoration: "underline",
              "&:hover": { color: "#f5576c" },
            }}
          >
            Forgot password?
          </Typography>

          <Button
            text="Log in"
            type="submit"
            onClick={handleSubmit}
            loadingPosition="start"
            sx={{ mt: 2, width: "100%" }}
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

      {/* Reset Password Modal */}
      <Dialog
        open={resetOpen}
        onClose={closeReset}
        PaperProps={{
          sx: {
            width: 420,
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 0 30px rgba(240, 147, 251, 0.35)",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #f093fb, #f5576c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Reset your password
        </DialogTitle>

        <DialogContent dividers>
          {resetErr && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetErr}
            </Alert>
          )}
          {resetOk && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetOk}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={resetForm.email}
            onChange={(e) => setResetForm((s) => ({ ...s, email: e.target.value }))}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={resetForm.password}
            onChange={(e) => setResetForm((s) => ({ ...s, password: e.target.value }))}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
            helperText="Minimum 8 characters"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={resetForm.confirm}
            onChange={(e) => setResetForm((s) => ({ ...s, confirm: e.target.value }))}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "#2c2c2c", borderRadius: 1 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            text="Cancel"
            variant="outlined"
            onClick={closeReset}
            disabled={resetLoading}
            sx={{
              borderColor: "#00eaff",
              color: "#00eaff",
              "&:hover": { borderColor: "#ffcc00", color: "#ffcc00" },
            }}
          />
          <Button
            text={resetLoading ? "Saving..." : "Reset Password"}
            onClick={submitReset}
            disabled={resetLoading}
            sx={{
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              boxShadow: "0px 0px 20px rgba(240, 147, 251, 0.6)",
            }}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
