import React from "react";
import { AppBar, Box, Typography, IconButton, Container } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material"; // X is Twitter in MUI

const Footer = () => {
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

        {/* Aurora AI Logo (Centered) */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <img src="/assets/logo.png" alt="Aurora AI Logo" style={{ width: 50, height: 50, marginRight: 10 }} />
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

        {/* Support Email (Below Logo) */}
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
