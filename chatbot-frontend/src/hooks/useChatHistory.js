import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useChatHistory = (userData) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!userData?.token) return;
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

  return {
    chatHistory,
    message,
    setMessage,
    loading,
    sendMessage,
    chatContainerRef,
  };
};

export default useChatHistory;
