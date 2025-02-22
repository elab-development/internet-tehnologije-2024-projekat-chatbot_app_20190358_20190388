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
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import React, { useState, useEffect } from "react";

function App() {
  // Initialize state from sessionStorage
  const [userData, setUserData] = useState(getStoredUserData());

  function getStoredUserData() {
    return {
      id: sessionStorage.getItem("userId"),
      role: sessionStorage.getItem("userRole"),
      name: sessionStorage.getItem("userName"),
      token: sessionStorage.getItem("userToken"),
    };
  }

  // When the app mounts, update the state from sessionStorage
  useEffect(() => {
    setUserData(getStoredUserData());
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

  // If the user is logged in but still on the login/register page,
  // automatically navigate them to "/home"
  useEffect(() => {
    if (userData.token && ["/", "/register"].includes(location.pathname)) {
      navigate("/home");
    }
  }, [userData, location.pathname, navigate]);

  // Show navbar and footer if a token exists (i.e. user is logged in)
  let showNavbar = Boolean(userData.token);

  const handleLogout = () => {
    // Clear sessionStorage and update state immediately
    sessionStorage.clear();
    setUserData({ id: null, role: null, name: null, token: null });

    // After a delay (to allow for any logout animations), navigate to login page
    navigate("/");
    showNavbar = false;
  };

  return (
    <>
      {showNavbar && <Navbar user={userData} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<Homepage/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/chat" element={<h1>Chat Page</h1>} />
        <Route
          path="/subscription"
          element={<h1>Subscription Plan Page</h1>}
        />
      </Routes>
      {showNavbar && <Footer />}
    </>
  );
};

export default App;
