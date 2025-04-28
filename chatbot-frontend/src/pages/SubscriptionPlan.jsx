import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "../components/Button";

const SubscriptionPlan = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Subscription Plans";

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

  const featureStyles = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  };

  const iconStyle = {
    fontSize: "24px",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #050505, #0d0d26, #131340)",
        color: "white",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Typewriter Animated Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "36px", md: "56px" },
            background: "linear-gradient(90deg, #f093fb, #f5576c, #24243e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 5,
            textShadow: "0px 0px 30px rgba(255, 0, 127, 1)",
          }}
        >
          {displayedText}
        </Typography>

        {/* Grid Container for Plans */}
        <Grid container spacing={5} justifyContent="center">
          {/* Free Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 6,
                borderRadius: 5,
                minHeight: "550px",
                background: "linear-gradient(135deg, #3a3a3a, #1f1f1f)",
                textAlign: "center",
                boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography variant="h3" sx={{ color: "#E0E0E0", fontWeight: "bold" }}>
                Free
              </Typography>
              <Typography variant="h4" color="gray" sx={{ mt: 1 }}>
                $0/month
              </Typography>
              <Box sx={{ mt: 4, textAlign: "left" }}>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Basic AI Chat
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Limited Responses
                </Typography>
                <Typography sx={featureStyles}>
                  <CancelIcon sx={{ color: "#FF1744", ...iconStyle }} /> No Image Generation
                </Typography>
                <Typography sx={featureStyles}>
                  <CancelIcon sx={{ color: "#FF1744", ...iconStyle }} /> No AI Automation
                </Typography>
                <Typography sx={featureStyles}>
                  <CancelIcon sx={{ color: "#FF1744", ...iconStyle }} /> No Priority Support
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Premium Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 6,
                borderRadius: 5,
                minHeight: "550px",
                background: "linear-gradient(135deg,rgb(230, 172, 130),rgb(242, 153, 196))",
                textAlign: "center",
                boxShadow: "0px 0px 30px rgba(255, 105, 180, 0.5)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold", color:"#007AFF"}}>
                Premium
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                $9.99/month
              </Typography>
              <Box sx={{ mt: 4, textAlign: "left" }}>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Unlimited AI Chat
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Faster Responses
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> AI Image Generation
                </Typography>
                <Typography sx={featureStyles}>
                  <CancelIcon sx={{ color: "#FF1744", ...iconStyle }} /> No AI Automation
                </Typography>
                <Typography sx={featureStyles}>
                  <CancelIcon sx={{ color: "#FF1744", ...iconStyle }} /> No Priority Support
                </Typography>
              </Box>
              <Box mt={5}>
                <Button
                  text="Subscribe Now"
                  sx={{
                    fontSize: "20px",
                    padding: "14px 28px",
                    background: "linear-gradient(90deg, #f093fb, #f5576c)",
                    boxShadow: "0px 0px 30px rgba(240, 147, 251, 0.8)",
                    "&:hover": {
                      boxShadow: "0px 0px 50px rgba(240, 147, 251, 1)",
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Pro Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={6}
              sx={{
                p: 6,
                borderRadius: 5,
                minHeight: "550px",
                background: "linear-gradient(135deg, #007AFF, #0056D2)",
                textAlign: "center",
                boxShadow: "0px 0px 30px rgba(0, 122, 255, 0.5)",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold", color:"#00E676"}}>
                Pro
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                $19.99/month
              </Typography>
              <Box sx={{ mt: 4, textAlign: "left" }}>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Everything in Premium
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> AI-Powered Automation
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Priority Support
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Advanced AI Tools
                </Typography>
                <Typography sx={featureStyles}>
                  <CheckCircleIcon sx={{ color: "#00E676", ...iconStyle }} /> Access to Future Features
                </Typography>
              </Box>
              <Box mt={5}>
                <Button
                  text="Subscribe Now"
                  sx={{
                    fontSize: "20px",
                    padding: "14px 28px",
                    background: "linear-gradient(90deg, #f093fb, #f5576c)",
                    boxShadow: "0px 0px 30px rgba(240, 147, 251, 0.8)",
                    "&:hover": {
                      boxShadow: "0px 0px 50px rgba(240, 147, 251, 1)",
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SubscriptionPlan;
