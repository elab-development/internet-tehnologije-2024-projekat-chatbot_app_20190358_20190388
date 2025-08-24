import React from "react";
import { AppBar, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1a1a2e",
        padding: "20px 0",
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        {/* Clickable Aurora AI Logo */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={1}
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

        {/* Support Email */}
        <Typography variant="body2" color="gray">
          Need help? Contact us at{" "}
          <Typography
            component="a"
            href="mailto:support@auroraai.com"
            sx={{
              color: "#f093fb",
              fontWeight: "bold",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            support@auroraai.com
          </Typography>
        </Typography>
      </Container>
    </AppBar>
  );
};

export default Footer;
