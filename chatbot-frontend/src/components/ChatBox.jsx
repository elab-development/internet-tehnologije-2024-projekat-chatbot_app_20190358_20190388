import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const ChatBox = ({ message, isUser }) => {
  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      width="100%"
      mb={2}
    >
      <Paper
        sx={{
          maxWidth: "60%",
          padding: "14px 14px",
          borderRadius: "18px",
          background: isUser
            ? "linear-gradient(135deg, #007AFF, #0056D2)"
            : "linear-gradient(135deg, #3a3a3a, #1f1f1f)",
          color: isUser ? "white" : "#f5f5f5",
          boxShadow: isUser
            ? "0px 4px 12px rgba(0, 122, 255, 0.3)"
            : "0px 4px 12px rgba(255, 255, 255, 0.1)",
          textAlign: "left",
          wordWrap: "break-word",
        }}
      >
        <Typography variant="body1" sx={{ fontSize: "16px" }}>
          {message.message}
        </Typography>
        <Typography variant="caption" display="block" textAlign="right" color={isUser ? "#D1E9FF" : "gray"}>
          {new Date(message.timestamp).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatBox;
