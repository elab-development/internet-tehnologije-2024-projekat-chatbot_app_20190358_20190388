import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import Button from "../components/Button"; // Reusable Button
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome to Aurora AI – The Future of Intelligence.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, index));
      index++;

      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
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
        paddingX: 3,
      }}
    >
      <Container maxWidth="md">
        {/* Typewriter Animated Heading */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "20px", md: "36px" },
            textShadow: "0px 0px 25px rgba(255, 0, 127, 1)",
            background: "linear-gradient(90deg, #ff007f, #ffcc00, #00eaff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 2,
          }}
        >
          {displayedText}
        </Typography>

        {/* AI Description Below Heading */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "14px", md: "18px" },
            fontWeight: "300",
            color: "#c4c6ff",
            maxWidth: "80%",
            margin: "0 auto",
            marginBottom: 4,
            lineHeight: "1.8",
          }}
        >
          Aurora AI is redefining intelligence with cutting-edge deep learning algorithms
          and autonomous decision-making capabilities. Experience a new era of AI
          where <strong>innovation meets efficiency</strong>.
        </Typography>

        {/* Neon Buttons */}
        <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
          {/* "Learn More" Button with Pink–Orange Gradient (Same as Logout) */}
          <Button
            text="Learn More"
            onClick={() => navigate("/about")}
            sx={{
              fontSize: "18px",
              padding: "14px 32px",
              /* Same gradient as "Logout" button */
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              boxShadow: "0px 0px 30px rgba(240, 147, 251, 0.8)",
              "&:hover": {
                boxShadow: "0px 0px 50px rgba(240, 147, 251, 1)",
                transform: "scale(1.05)",
              },
            }}
          />

          {/* Outlined Neon Button */}
          <Button
            text="Get Started"
            onClick={() => navigate("/subscription")}
            variant="outlined"
            sx={{
              fontSize: "18px",
              padding: "14px 32px",
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

export default HomePage;
