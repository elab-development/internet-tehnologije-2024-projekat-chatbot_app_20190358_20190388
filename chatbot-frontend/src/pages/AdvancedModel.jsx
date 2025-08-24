import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Container, TextField, Paper, Typography } from "@mui/material";
import ChatBox from "../components/ChatBox";
import Button from "../components/Button";

const API_BASE = "http://127.0.0.1:8000/api";
const GH_ENDPOINT = "https://models.github.ai/inference";
const GH_MODEL = "openai/gpt-4o-mini";

// IMPORTANT: put REACT_APP_GITHUB_TOKEN in your React .env file
const GH_TOKEN =
  process.env.REACT_APP_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";

const AdvancedModel = ({ userData }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // auth token for Laravel API calls
  const appToken = useMemo(
    () => userData?.token || sessionStorage.getItem("userToken") || null,
    [userData]
  );

  // ————— Title typewriter
  useEffect(() => {
    const fullText = "Aurora AI – Advanced Model";
    let i = 0;
    const id = setInterval(() => {
      setDisplayedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  // ————— Load saved history from backend (advanced model only)
  useEffect(() => {
    if (!appToken) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/advanced-chat-history`, {
          headers: { Authorization: `Bearer ${appToken}` },
        });
        const json = await res.json().catch(() => ({}));
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        setChatHistory(
          list.map((r) => ({
            id: r.id ?? r._id ?? Math.random().toString(36),
            message: r.message ?? r.question ?? "",
            response: r.response ?? r.answer ?? "",
            timestamp: r.created_at ?? r.timestamp ?? new Date().toISOString(),
          }))
        );
      } catch {
        // ignore
      }
    })();
  }, [appToken]);

  // ————— Scroll to bottom when history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!userData || !appToken) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Loading user data...</Typography>
      </Box>
    );
  }

  // ————— Ask GitHub Model (SDK first, fallback to fetch)
  const askModel = async (prompt) => {
    if (!GH_TOKEN) throw new Error("Missing REACT_APP_GITHUB_TOKEN in React .env");

    // Try the Azure SDK shape the user provided; if unavailable in browser, fallback to fetch.
    try {
      const { default: ModelClient, isUnexpected } = await import("@azure-rest/ai-inference");
      const { AzureKeyCredential } = await import("@azure/core-auth");

      const client = ModelClient(GH_ENDPOINT, new AzureKeyCredential(GH_TOKEN));
      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: "" },
            { role: "user", content: prompt },
          ],
          model: GH_MODEL,
        },
      });

      if (isUnexpected(response)) throw response.body.error;
      return response.body.choices?.[0]?.message?.content ?? "";
    } catch {
      // Fallback to plain fetch (works great in browser)
      const res = await fetch(`${GH_ENDPOINT}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GH_TOKEN}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "" },
            { role: "user", content: prompt },
          ],
          model: GH_MODEL,
        }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`GitHub Models error: ${res.status} ${txt}`);
      }
      const json = await res.json();
      return json?.choices?.[0]?.message?.content ?? "";
    }
  };

  // ————— Save to backend
  const saveQA = async (q, a) => {
    try {
      await fetch(`${API_BASE}/advanced-chat-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appToken}`,
        },
        body: JSON.stringify({ message: q, response: a }),
      });
    } catch {
      // non-fatal
    }
  };

  // ————— Send handler
  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    setLoading(true);

    const ts = new Date().toISOString();
    const newUserMsg = {
      id: `u-${ts}`,
      message: trimmed,
      response: "",
      timestamp: ts,
    };
    setChatHistory((h) => [...h, newUserMsg]);
    setMessage("");

    try {
      const answer = await askModel(trimmed);
      const botMsg = {
        id: `a-${Date.now()}`,
        message: "",
        response: answer,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((h) => [...h, botMsg]);
      // persist
      saveQA(trimmed, answer);
    } catch (err) {
      const botErr = {
        id: `e-${Date.now()}`,
        message: "",
        response: `⚠️ ${err?.message || "Failed to get a response."}`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((h) => [...h, botErr]);
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
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

        {/* History */}
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
            "&::-webkit-scrollbar": { width: "10px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 105, 180, 0.7)",
              borderRadius: "10px",
            },
          }}
          ref={chatContainerRef}
        >
          {loading && chatHistory.length === 0 ? (
            <Typography variant="body1" textAlign="center" sx={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
              Loading...
            </Typography>
          ) : chatHistory.length === 0 ? (
            <Typography variant="body1" textAlign="center" sx={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
              No messages yet.
            </Typography>
          ) : (
            chatHistory.map((msg) => (
              <React.Fragment key={msg.id}>
                {msg.message && (
                  <ChatBox message={{ message: msg.message, timestamp: msg.timestamp }} isUser={true} />
                )}
                {msg.response && (
                  <ChatBox message={{ message: msg.response, timestamp: msg.timestamp }} isUser={false} />
                )}
              </React.Fragment>
            ))
          )}
        </Paper>

        {/* Input */}
        <Box mt={2} width="90%" display="flex" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask the advanced model..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            sx={{
              backgroundColor: "#2c2c2c",
              borderRadius: 2,
              input: { color: "white" },
              "& fieldset": { borderColor: "#c4c6ff" },
            }}
          />
          <Button
            text={loading ? "Sending..." : "Send"}
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

export default AdvancedModel;
