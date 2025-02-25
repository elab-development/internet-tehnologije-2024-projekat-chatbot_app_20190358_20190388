import React, { useState, useEffect } from "react";
import { Box, Container, TextField, CircularProgress, Typography, Paper } from "@mui/material";
import Button from "../components/Button";

const GenerateImage = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "AI Image Generator";

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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
      if (!response.ok) {
        throw new Error("Failed to generate image.");
      }
      
      setImage(response.url);
    } catch (error) {
      setError("❌ Failed to generate image. Please try again.");
      console.error("❌ Error generating image:", error);
    } finally {
      setLoading(false);
    }
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
      <Container maxWidth="md">
        {/* Typewriter Animated Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "32px", md: "50px" },
            background: "linear-gradient(90deg, #f093fb, #f5576c, #24243e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 5,
            textShadow: "0px 0px 30px rgba(255, 0, 127, 1)",
          }}
        >
          {displayedText}
        </Typography>

        {/* Input & Generate Button */}
        <Box display="flex" gap={2} alignItems="center" justifyContent="center" mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              backgroundColor: "#2c2c2c",
              borderRadius: 2,
              input: { color: "white" },
              "& fieldset": { borderColor: "#c4c6ff" },
            }}
          />
          <Button
            text="Generate"
            onClick={handleGenerate}
            disabled={loading}
            sx={{
              fontSize: "16px",
              padding: "12px 24px",
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              boxShadow: "0px 0px 30px rgba(240, 147, 251, 0.8)",
              "&:hover": {
                boxShadow: "0px 0px 50px rgba(240, 147, 251, 1)",
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mb: 3, fontSize: "20px", fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {/* Image Display */}
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            mt: 2,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <CircularProgress color="secondary" />
          ) : image ? (
            <img 
              src={image} 
              alt="Generated AI" 
              style={{ 
                width: "100%", 
                height: "100%", 
                maxWidth: "100%", 
                maxHeight: "100%", 
                objectFit: "contain", // Ensures full image is visible without cropping
                display: "block", // Removes unwanted spaces
                borderRadius: "10px" 
              }} 
            />
          ) : (
            <Typography 
              variant="body1" 
              sx={{ fontSize: "25px", fontWeight: "bold", color: "white" }}
            >
              No images generated yet.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default GenerateImage;
