import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
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

    if (storedId && storedRole && storedToken && storedName) {
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
      <AppContent userData={userData} onLogout={handleLogout} setUserData={setUserData} />
    </Router>
  );
}

const AppContent = ({ userData, onLogout, setUserData }) => {
  const location = useLocation();
  const showNavbar = userData.token !== null && !["/", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={userData} onLogout={onLogout} />}
      <Routes>
        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<h1>Home Page</h1>} />
        <Route path="/about" element={<h1>About Us Page</h1>} />
        <Route path="/chat" element={<h1>Chat Page</h1>} />
        <Route path="/subscription" element={<h1>Subscription Plan Page</h1>} />
      </Routes>
    </>
  );
};

export default App;
