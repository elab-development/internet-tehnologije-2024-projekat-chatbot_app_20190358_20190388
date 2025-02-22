import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState({
    id: null,
    role: null,
    name: null,
    token: null,
  });

  useEffect(() => {

    const storedId = sessionStorage.getItem("userId");
    const storedRole = sessionStorage.getItem("userRole");
    const storedName = sessionStorage.getItem("userName");
    const storedToken = sessionStorage.getItem("userToken");

    if (storedId && storedRole && storedToken ^ storedName) {
      setUserData({
        id: storedId,
        role: storedRole,
        name: storedName,
        token: storedToken,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUserData({
      id: null,
      role: null,
      name: null,
      token: null,
    });
  };

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default App;