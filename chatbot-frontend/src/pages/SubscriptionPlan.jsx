import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  // ——————————— Typewriter title ———————————
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    const fullText = "Subscription Plans";
    let i = 0;
    const id = setInterval(() => {
      setDisplayedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  // ——————————— Session storage (supports both shapes) ———————————
  const { userId, token } = useMemo(() => {
    try {
      const fromSimple = {
        userId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem("userToken"),
      };
      if (fromSimple.userId && fromSimple.token) return fromSimple;

      const raw = sessionStorage.getItem("userData");
      const obj = raw ? JSON.parse(raw) : {};
      return {
        userId: obj?.id ?? obj?.user?.id ?? null,
        token: obj?.token ?? null,
      };
    } catch {
      return { userId: null, token: null };
    }
  }, []);

  // ——————————— Current subscription id (from session) ———————————
  const [currentSubId, setCurrentSubId] = useState(() => {
    // Prefer a dedicated key if present, else try userData.subscription_id
    const stored = sessionStorage.getItem("subscription_id");
    if (stored !== null) return Number(stored) || null;
    try {
      const raw = sessionStorage.getItem("userData");
      if (!raw) return null;
      const obj = JSON.parse(raw);
      const sid = obj?.subscription_id ?? obj?.user?.subscription_id ?? null;
      return sid != null ? Number(sid) : null;
    } catch {
      return null;
    }
  });

  // ——————————— Load plans from API (FULL URL) ———————————
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/subscriptions?only_active=1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} – ${text}`);
        }

        const data = await res.json();
        if (!mounted) return;
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setPlans(list);
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load plans.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ——————————— Subscribe handler (FULL URL) ———————————
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const openSnack = (msg, sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const handleSubscribe = async (planId) => {
    if (!token || !userId) {
      openSnack("Please log in to subscribe.", "warning");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/subscription`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription_id: planId }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} – ${text}`);
      }
      const json = await res.json();

      // reflect immediately in UI + sessionStorage
      const updatedId =
        json?.data?.subscription_id ??
        json?.data?.subscription?.id ??
        planId;

      setCurrentSubId(updatedId != null ? Number(updatedId) : null);
      sessionStorage.setItem(
        "subscription_id",
        updatedId != null ? String(updatedId) : ""
      );

      // If you also store userData, keep it in sync
      try {
        const raw = sessionStorage.getItem("userData");
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj) {
            obj.subscription_id = updatedId ?? null;
            if (obj.user) obj.user.subscription_id = updatedId ?? null;
            sessionStorage.setItem("userData", JSON.stringify(obj));
          }
        }
      } catch {}

      openSnack("Subscription updated successfully!");
      navigate(0);
    } catch (e) {
      openSnack(e?.message || "Failed to update subscription.", "error");
    }
  };

  // ——————————— Card look & features by plan name ———————————
  const decoratePlan = (plan) => {
    const name = (plan.name || "").toLowerCase();
    if (name.includes("free")) {
      return {
        bg: "linear-gradient(135deg, #3a3a3a, #1f1f1f)",
        glow: "0px 0px 25px rgba(255,255,255,0.1)",
        accent: "#E0E0E0",
        features: [
          ["Basic AI Chat", true],
          ["Limited Responses", true],
          ["Image Generation", false],
          ["AI Automation", false],
          ["Priority Support", false],
        ],
      };
    }
    if (name.includes("premium")) {
      return {
        bg: "linear-gradient(135deg,rgb(230,172,130),rgb(242,153,196))",
        glow: "0px 0px 30px rgba(255,105,180,0.5)",
        accent: "#007AFF",
        features: [
          ["Unlimited AI Chat", true],
          ["Faster Responses", true],
          ["AI Image Generation", true],
          ["AI Automation", false],
          ["Priority Support", false],
        ],
      };
    }
    // default/pro
    return {
      bg: "linear-gradient(135deg, #007AFF, #0056D2)",
      glow: "0px 0px 30px rgba(0,122,255,0.5)",
      accent: "#00E676",
      features: [
        ["Everything in Premium", true],
        ["AI-Powered Automation", true],
        ["Priority Support", true],
        ["Advanced AI Tools", true],
        ["Access to Future Features", true],
      ],
    };
  };

  const featureStyles = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  };
  const iconStyle = { fontSize: "24px" };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #050505, #0d0d26, #131340)",
        color: "white",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: "36px", md: "56px" },
            background: "linear-gradient(90deg, #f093fb, #f5576c, #24243e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 5,
            textShadow: "0px 0px 30px rgba(255, 0, 127, 1)",
          }}
        >
          {displayedText}
        </Typography>

        {loading && <CircularProgress />}
        {err && (
          <Typography color="error" sx={{ mb: 2 }}>
            {String(err)}
          </Typography>
        )}

        {!loading && (
          <Grid container spacing={5} justifyContent="center">
            {plans.length === 0 && (
              <Typography sx={{ color: "#E0E0E0" }}>
                No plans available. Make sure your API at{" "}
                {API_BASE}/subscriptions returns data and that you’re
                authenticated.
              </Typography>
            )}

            {plans.map((plan) => {
              const deco = decoratePlan(plan);
              const isCurrent =
                currentSubId != null && Number(currentSubId) === Number(plan.id);

              return (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Paper
                    elevation={isCurrent ? 10 : 6}
                    sx={{
                      p: 6,
                      borderRadius: 5,
                      minHeight: "550px",
                      background: deco.bg,
                      textAlign: "center",
                      boxShadow: deco.glow,
                      position: "relative",
                      outline: isCurrent ? "2px solid #00E676" : "none",
                    }}
                  >
                    {/* Current badge */}
                    {isCurrent && (
                      <Chip
                        label="Current plan"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontWeight: "bold",
                        }}
                      />
                    )}

                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", color: deco.accent }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      ${Number(plan.price).toFixed(2)}/{plan.interval}
                    </Typography>

                    <Box sx={{ mt: 1, minHeight: 72 }}>
                      {plan.description && (
                        <Typography sx={{ color: "#EAEAEA", mt: 1 }}>
                          {plan.description}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mt: 4, textAlign: "left" }}>
                      {deco.features.map(([label, ok]) => (
                        <Typography key={label} sx={featureStyles}>
                          {ok ? (
                            <CheckCircleIcon
                              sx={{ color: "#00E676", ...iconStyle }}
                            />
                          ) : (
                            <CancelIcon
                              sx={{ color: "#FF1744", ...iconStyle }}
                            />
                          )}
                          {label}
                        </Typography>
                      ))}
                    </Box>

                    {/* Action */}
                    <Box mt={5}>
                      {isCurrent ? (
                        <Typography sx={{ color: "#E0E0E0", fontWeight: "bold" }}>
                          This is your active plan.
                        </Typography>
                      ) : (
                        <Button
                          text="Subscribe Now"
                          onClick={() => handleSubscribe(plan.id)}
                          delay={0}
                          sx={{
                            fontSize: "20px",
                            padding: "14px 28px",
                            background:
                              "linear-gradient(90deg, #f093fb, #f5576c)",
                            boxShadow:
                              "0px 0px 30px rgba(240, 147, 251, 0.8)",
                            "&:hover": {
                              boxShadow:
                                "0px 0px 50px rgba(240, 147, 251, 1)",
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscriptionPlan;
