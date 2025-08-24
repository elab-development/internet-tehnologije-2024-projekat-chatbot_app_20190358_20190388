import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Container } from "@mui/material";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ userData }) => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome Admin to the dashboard of our chat web app.";

  // Resolve role from props or sessionStorage (non-blocking)
  const role = useMemo(() => {
    if (userData?.user_role) return userData.user_role;
    return sessionStorage.getItem("userRole") || "";
  }, [userData]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top, #050505, #0d0d26, #131340)",
        color: "white",
        textAlign: "center",
        px: 3,
      }}
    >
      <Container maxWidth="md">
        {/* Typewriter Heading */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "32px", md: "50px" },
            textShadow: "0px 0px 25px rgba(255, 0, 127, 1)",
            background: "linear-gradient(90deg, #ff007f, #ffcc00, #00eaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          {displayedText}
        </Typography>

        {/* Sub text (optional) */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "14px", md: "18px" },
            fontWeight: "300",
            color: "#c4c6ff",
            maxWidth: "80%",
            mx: "auto",
            mb: 4,
            lineHeight: 1.8,
          }}
        >
          Manage insights and users for Aurora AI. {role?.toLowerCase() !== "admin" ? "(view-only mode)" : ""}
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
          {/* Primary (filled) */}
          <Button
            text="View Analytics"
            onClick={() => navigate("/analytics")}
            sx={{
              fontSize: "18px",
              py: "14px",
              px: "32px",
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              boxShadow: "0px 0px 30px rgba(240, 147, 251, 0.8)",
              "&:hover": {
                boxShadow: "0px 0px 50px rgba(240, 147, 251, 1)",
                transform: "scale(1.05)",
              },
            }}
          />

          {/* Secondary (outlined neon) */}
          <Button
            text="User Management"
            onClick={() => navigate("/user-management")}
            variant="outlined"
            sx={{
              fontSize: "18px",
              py: "14px",
              px: "32px",
              borderColor: "#00eaff",
              color: "#00eaff",
              boxShadow: "0px 0px 30px rgba(0, 234, 255, 0.8)",
              "&:hover": {
                borderColor: "#ffcc00",
                color: "#ffcc00",
                boxShadow: "0px 0px 50px rgba(255, 204, 0, 1)",
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
