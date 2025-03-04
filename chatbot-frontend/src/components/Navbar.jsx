import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button as MUIButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button"; // Reusable MUI Button for Logout

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: "Home", path: "/home" },
    { text: "About Us", path: "/about" },
    { text: "Chat", path: "/chat" },
    { text: "Generate Image", path: "/generate-image" },
    { text: "Subscription Plan", path: "/subscription" },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a1a2e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Clickable Logo Section */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s ease-in-out",
            },
          }}
          onClick={() => navigate("/home")} // 👈 Click navigates to Home
        >
          <img
            src="/assets/logo.png"
            alt="Aurora AI Logo"
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <Typography
            variant="h5"
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

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map((item, index) => (
            <MUIButton
              key={index}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                position: "relative",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transform: "scale(1.05)",
                },
              }}
            >
              {item.text}
            </MUIButton>
          ))}
        </Box>

        {/* User Section */}
        <Box display="flex" alignItems="center">
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {user ? `Welcome, ${user.name}` : "Guest"}
          </Typography>

          {/* Logout Button (Gradient) */}
          <Button
            text="Logout"
            onClick={onLogout}
            sx={{
              background: "linear-gradient(90deg, #ff5b99, #ff9966)",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 0 20px rgba(255, 91, 153, 0.6)",
              "&:hover": {
                boxShadow: "0 0 40px rgba(255, 91, 153, 1)",
                transform: "scale(1.05)",
              },
            }}
          />

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(item.path);
              handleMenuClose();
            }}
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
