// src/components/DynamicBreadcrumbs.jsx
import React, { useMemo } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // read role from session (same keys you already use)
  const role = (sessionStorage.getItem("userRole") || "").toLowerCase();

  // Home destination based on role
  const homePath = role === "admin" ? "/admin-dashboard" : "/home";

  // Label overrides (role-aware)
  const overrides = useMemo(() => {
    const base = {
      "advanced-model": "Advanced Model",
    };
    if (role === "admin") {
      base["analytics"] = "Analytics";
      base["user-management"] = "User Management";
      base["admin-dashboard"] = "Admin Dashboard";
    }
    return base;
  }, [role]);

  // Turn a url segment into a nice label
  const pretty = (seg) => {
    const key = seg.toLowerCase();
    if (overrides[key]) return overrides[key];
    return key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        textAlign: "center",
        background:
          "linear-gradient(90deg, rgba(20,20,50,1) 0%, rgba(40,40,80,1) 100%)",
        boxShadow: "0px 4px 20px rgba(255, 0, 127, 0.3)",
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ color: "#ff66b2" }} />}
        aria-label="breadcrumb"
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: "18px",
          "& .MuiBreadcrumbs-separator": { mx: 1 },
        }}
      >
        {/* Home (role-aware) */}
        <Link
          component={RouterLink}
          to={homePath}
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#ff66b2",
            fontSize: "18px",
            fontWeight: "bold",
            textShadow: "0px 0px 10px rgba(255, 105, 180, 0.8)",
            transition: "all 0.3s",
            "&:hover": {
              color: "#f093fb",
              textShadow: "0px 0px 20px rgba(255, 105, 180, 1)",
            },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: "20px" }} />
          Home
        </Link>

        {/* Rest of crumbs */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = pretty(value);

          return last ? (
            <Typography
              key={to}
              sx={{
                color: "#f093fb",
                fontWeight: "bold",
                fontSize: "18px",
                textShadow: "0px 0px 10px rgba(255, 105, 180, 1)",
              }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              underline="hover"
              key={to}
              sx={{
                color: "#ff66b2",
                fontSize: "18px",
                fontWeight: "bold",
                textShadow: "0px 0px 10px rgba(255, 105, 180, 0.8)",
                transition: "all 0.3s",
                "&:hover": {
                  color: "#f093fb",
                  textShadow: "0px 0px 20px rgba(255, 105, 180, 1)",
                },
              }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DynamicBreadcrumbs;
