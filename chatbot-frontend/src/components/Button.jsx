import React, { useState } from "react";
import { Button as MUIButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Button = ({
  text,
  onClick,
  type = "button",
  variant = "contained",
  color = "primary",
  disabled = false,
  sx = {},
  startIcon = null,
  endIcon = null,
  delay = 3000, // Default 1s delay before executing onClick
  loadingIndicator = "Loading...",
  loadingPosition = "center", // Options: "start", "end", "center"
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (onClick) {
      setLoading(true);

      // Pause for delay before executing onClick
      await new Promise((resolve) => setTimeout(resolve, delay));

      await onClick(e); // Execute original onClick after delay

      setLoading(false);
    }
  };

  return (
    <MUIButton
      type={type}
      onClick={handleClick}
      variant={variant}
      color={color}
      disabled={loading || disabled}
      sx={{
        minWidth: 120,
        height: 40,
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "none",
        ...sx,
      }}
      startIcon={loading && loadingPosition === "start" ? <CircularProgress size={20} /> : startIcon}
      endIcon={loading && loadingPosition === "end" ? <CircularProgress size={20} /> : endIcon}
    >
      {loading && loadingPosition === "center" ? (
        <CircularProgress size={24} color="inherit" />
      ) : loading ? (
        loadingIndicator
      ) : (
        text
      )}
    </MUIButton>
  );
};

export default Button;
