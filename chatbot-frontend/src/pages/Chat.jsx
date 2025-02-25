import React, { useState, useEffect, useRef } from "react";
import { Box, Container, TextField, Paper, Typography } from "@mui/material";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import Button from "../components/Button";

const Chat = ({ userData }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const chatContainerRef = useRef(null);
  const fullText = "Aurora AI Chat";

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

  console.log("Chat component mounted. Received userData:", userData);

  useEffect(() => {
    if (!userData?.token) {
      console.warn("userData not loaded yet. Waiting...");
      return;
    }
    fetchChatHistory();
  }, [userData]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/chat-history", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      console.log("API Response:", response.data);

      if (response.data.chat_history && Array.isArray(response.data.chat_history)) {
        setChatHistory(response.data.chat_history);
      } else {
        console.warn("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat-history",
        { chatbot_id: 1, message },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      console.log("Sent message response:", response.data);

      if (response.data.chat_history) {
        setChatHistory((prev) => [...prev, response.data.chat_history]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData || !userData.token) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #050505, #0d0d26, #131340)",
        color: "white",
        textAlign: "center",
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
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

        {/* Chat History Display */}
        <Paper
          elevation={3}
          sx={{
            minHeight: "450px",
            maxHeight: "600px",
            width: "90%",
            overflowY: "auto",
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 105, 180, 0.7)",
              borderRadius: "10px",
            },
          }}
          ref={chatContainerRef}
        >
          {chatHistory.length === 0 ? (
            <Typography variant="body1" color="textSecondary" textAlign="center">
              No messages found.
            </Typography>
          ) : (
            chatHistory.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {/* ✅ User Message (Right) */}
                <ChatBox message={{ message: msg.message, timestamp: msg.timestamp }} isUser={true} />

                {/* ✅ AI Response (Left) */}
                <ChatBox message={{ message: msg.response, timestamp: msg.timestamp }} isUser={false} />
              </React.Fragment>
            ))
          )}
        </Paper>

        {/* Input Field & Send Button */}
        <Box mt={2} width="90%" display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              backgroundColor: "#2c2c2c",
              borderRadius: 2,
              input: { color: "white" },
              "& fieldset": { borderColor: "#c4c6ff" },
            }}
          />
          <Button
            text="Send"
            onClick={sendMessage}
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
      </Container>
    </Box>
  );
};

export default Chat;
