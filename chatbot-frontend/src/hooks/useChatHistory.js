import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useChatHistory = (userData) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!userData?.token) return;
    fetchChatHistory();
  }, [userData]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/chat-history", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      if (response.data.chat_history && Array.isArray(response.data.chat_history)) {
        setTimeout(() => {
          setChatHistory(response.data.chat_history);
          setLoading(false); // Loading finished, show messages
        }, 2000); // Simulated delay for a smoother transition
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setChatHistory((prev) => [...prev, { message, response: "..." }]); // Show temporary loading response
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat-history",
        { chatbot_id: 1, message },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      if (response.data.chat_history) {
        setChatHistory((prev) => [...prev.slice(0, -1), response.data.chat_history]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return { chatHistory, message, setMessage, loading, sendMessage, chatContainerRef };
};

export default useChatHistory;
