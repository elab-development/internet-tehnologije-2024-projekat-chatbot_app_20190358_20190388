import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Chat from "./pages/Chat"; 
import GenerateImage from "./pages/GenerateImage"; 
import SubscriptionPlan from "./pages/SubscriptionPlan"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DynamicBreadcrumbs from "./components/DynamicBreadcrumbs";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState(getStoredUserData());

  function getStoredUserData() {
    return {
      id: sessionStorage.getItem("userId") || null,
      role: sessionStorage.getItem("userRole") || null,
      name: sessionStorage.getItem("userName") || null,
      token: sessionStorage.getItem("userToken") || null,
      subscription_id: sessionStorage.getItem("subscription_id") || null,
    };
  }

  useEffect(() => {
    setUserData(getStoredUserData());
    console.log("App.js userData:", userData);
  }, []);

  return (
    <Router>
      <AppContent userData={userData} setUserData={setUserData} />
    </Router>
  );
}

const AppContent = ({ userData, setUserData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.token && ["/", "/register"].includes(location.pathname)) {
      navigate("/home");
    }
  }, [userData, location.pathname, navigate]);

  let showNavbar = Boolean(userData.token);
  let showBreadcrumbs = showNavbar && location.pathname !== "/home";

  const handleLogout = () => {
    sessionStorage.clear();
    setUserData({ id: null, role: null, name: null, token: null });
    navigate("/");
    showNavbar = false;
  };

  return (
    <>
      {showNavbar && <Navbar user={userData} onLogout={handleLogout} />}
      {showBreadcrumbs && <DynamicBreadcrumbs />} 
      <Routes>
        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/chat" element={<Chat userData={userData} />} /> 
        <Route path="/generate-image" element={<GenerateImage/>} /> 
        <Route path="/subscription" element={<SubscriptionPlan/>} />
      </Routes>
      {showNavbar && <Footer />}
    </>
  );
};

export default App;
