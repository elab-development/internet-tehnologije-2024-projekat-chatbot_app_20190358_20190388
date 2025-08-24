import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button as MUIButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const API_BASE = "http://127.0.0.1:8000/api";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // --- Resolve role (props or sessionStorage), normalized
  const role = useMemo(() => {
    const raw =
      user?.user_role ??
      user?.role ??
      sessionStorage.getItem("userRole") ??
      "";
    return String(raw).trim().toLowerCase();
  }, [user]);
  const isAdmin = role === "admin";

  // --- Session values used for non-admin tiered menu
  const token = useMemo(() => sessionStorage.getItem("userToken") || null, []);
  const subscriptionId = useMemo(() => {
    const v = sessionStorage.getItem("subscription_id");
    return v && v !== "null" && v !== "" ? Number(v) : null;
  }, []);

  // --- Subscription tier (non-admin only)
  const [tier, setTier] = useState("free"); // "free" | "premium" | "pro"
  const normalizeTier = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("pro")) return "pro";
    if (n.includes("premium")) return "premium";
    return "free";
  };

  useEffect(() => {
    if (isAdmin) return; // admins don't need tier logic
    let alive = true;

    const setFromName = (name) => alive && setTier(normalizeTier(name));

    if (!subscriptionId) {
      setTier("free");
      return () => {
        alive = false;
      };
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const sub = json?.data ?? json;
        setFromName(sub?.name);
        if (sub?.name) sessionStorage.setItem("subscriptionName", sub.name);
      } catch {
        const cached = sessionStorage.getItem("subscriptionName");
        if (cached) setFromName(cached);
        else setTier("free");
      }
    })();

    return () => {
      alive = false;
    };
  }, [isAdmin, subscriptionId, token]);

  // --- Build menu items
  const menuItems = useMemo(() => {
    if (isAdmin) {
      // ✅ Admin menu: include Home -> /admin-dashboard, then Analytics, User Management
      return [
        { text: "Home", path: "/admin-dashboard" },
        { text: "Analytics", path: "/analytics" },
        { text: "User Management", path: "/user-management" },
      ];
    }

    // Non-admin: your original logic
    const items = [
      { text: "Home", path: "/home" },
      { text: "About Us", path: "/about" },
      { text: "Chat", path: "/chat" },
      { text: "Subscription Plan", path: "/subscription" },
    ];
    if (tier === "premium" || tier === "pro") {
      items.splice(3, 0, { text: "Generate Image", path: "/generate-image" }); // before Subscription
    }
    if (tier === "pro") {
      items.push({ text: "Advanced Model", path: "/advanced-model" });
    }
    return items;
  }, [isAdmin, tier]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ✅ Logo click goes to admin dashboard for admins; /home otherwise
  const homePath = isAdmin ? "/admin-dashboard" : "/home";

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a1a2e" }}>
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Logo (click -> Home or Admin Dashboard) */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: "pointer", "&:hover": { transform: "scale(1.05)", transition: "0.3s" } }}
          onClick={() => navigate(homePath)}
        >
          <img
            src="/assets/logo.png"
            alt="Aurora AI Logo"
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #f093fb, #f5576c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Aurora AI
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map((item) => (
            <MUIButton
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                position: "relative",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transform: "scale(1.05)",
                },
              }}
            >
              {item.text}
            </MUIButton>
          ))}
        </Box>

        {/* User + Logout + Mobile trigger */}
        <Box display="flex" alignItems="center">
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user ? `Welcome, ${user.name}` : "Guest"}
          </Typography>

          <Button
            text="Logout"
            onClick={onLogout}
            sx={{
              background: "linear-gradient(90deg, #ff5b99, #ff9966)",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 0 20px rgba(255, 91, 153, 0.6)",
              "&:hover": { boxShadow: "0 0 40px rgba(255, 91, 153, 1)", transform: "scale(1.05)" },
            }}
          />

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleMenuClose();
            }}
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
