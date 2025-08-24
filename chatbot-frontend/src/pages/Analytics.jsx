import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000/api";

// Brand palette + background
const brand = {
  bg:
    "radial-gradient(1200px 500px at 20% -10%, #161233 0%, #0f1433 35%, #0e1431 60%, #0c1734 85%, #0b1837 100%)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  textDim: "#c9c8ff",
  free: "#22c55e",  // green
  paid: "#f0a3ff",  // lilac/pink
  bar: "#8b5cf6",   // violet
};

function normalizeName(n) {
  const s = String(n || "").trim();
  if (/^free$/i.test(s)) return "Free";
  if (/pro/i.test(s)) return "Pro";
  if (/premium/i.test(s)) return "Premium";
  return s || "Unknown";
}

export default function Analytics() {
  const token = useMemo(() => sessionStorage.getItem("userToken") || "", []);
  const role = useMemo(
    () => (sessionStorage.getItem("userRole") || "").toLowerCase(),
    []
  );
  const isAdmin = role === "admin";

  const [typedTitle, setTypedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [stats, setStats] = useState({
    totals: { total_users: 0, admins: 0, regulars: 0, free: 0, paid: 0 },
    plans: [],
  });

  // Title typewriter
  useEffect(() => {
    const full = "Analytics Dashboard";
    let i = 0;
    const id = setInterval(() => {
      setTypedTitle(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  // Fetch + reconcile data
  useEffect(() => {
    if (!token) {
      setErr("Missing auth token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/users/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        const json = await res.json();

        const apiTotals = json?.totals || {};
        const plansArr = Array.isArray(json?.plans) ? json.plans : [];

        // Map/normalize plans
        const mappedPlans = plansArr.map((p) => ({
          name: normalizeName(p.name),
          count: Number(p.count ?? p.users_count ?? 0),
        }));

        // Derive Free/Paid **from the plans** (source of truth for charts)
        const totalByPlans = mappedPlans.reduce((a, b) => a + b.count, 0);
        const freeFromPlans = mappedPlans
          .filter((p) => /free/i.test(p.name))
          .reduce((a, b) => a + b.count, 0);
        const paidFromPlans = Math.max(totalByPlans - freeFromPlans, 0);

        // Reconcile cards:
        // - Prefer API total_users/admins if present
        // - Derive regulars if missing
        // - **Always** use plan-derived free/paid for consistency with charts
        const totalUsers =
          Number(apiTotals.total_users ?? 0) > 0
            ? Number(apiTotals.total_users)
            : totalByPlans;
        const admins = Number(apiTotals.admins ?? 0);
        const regulars =
          Number(apiTotals.regulars ?? 0) > 0
            ? Number(apiTotals.regulars)
            : Math.max(totalUsers - admins, 0);

        // Sort bars in a friendly order: Free, Premium, Pro, then others
        const order = { Free: 0, Premium: 1, Pro: 2 };
        mappedPlans.sort((a, b) => {
          const A = order[a.name] ?? 99;
          const B = order[b.name] ?? 99;
          if (A !== B) return A - B;
          return a.name.localeCompare(b.name);
        });

        setStats({
          totals: {
            total_users: totalUsers,
            admins,
            regulars,
            free: freeFromPlans,
            paid: paidFromPlans,
          },
          plans: mappedPlans,
        });
      } catch (e) {
        setErr(e.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const pieData = [
    { name: "Free", value: stats.totals.free },
    { name: "Paid", value: stats.totals.paid },
  ];
  const barData =
    stats.plans.length > 0 ? stats.plans : [{ name: "No data", count: 0 }];

  if (!isAdmin) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.bg,
          color: "white",
        }}
      >
        <Typography variant="h5">403 — Admins only</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: brand.bg,
        color: "white",
        py: { xs: 4, md: 6 },
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Neon header (typewriter) */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: 36, md: 56 },
            mb: 3,
            letterSpacing: "1px",
            background:
              "linear-gradient(90deg, #ff58a6 0%, #ff7cb9 20%, #c17cff 60%, #7ea6ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0 0 12px rgba(255, 88, 166, .55), 0 0 28px rgba(193,124,255,.45)",
          }}
        >
          {typedTitle}
        </Typography>

        {loading ? (
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : err ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {err}
          </Alert>
        ) : (
          <>
            {/* Top cards */}
            <Grid container spacing={2.5} sx={{ mb: 2 }}>
              {[
                { label: "Total Users", val: stats.totals.total_users },
                { label: "Admins", val: stats.totals.admins },
                { label: "Regulars", val: stats.totals.regulars },
                { label: "Free", val: stats.totals.free },
                { label: "Paid", val: stats.totals.paid },
              ].map((c) => (
                <Grid item xs={12} sm={6} md={2.4} key={c.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      textAlign: "left",
                      background: brand.card,
                      borderRadius: 3,
                      border: `1px solid ${brand.border}`,
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <Typography sx={{ color: 'white', mb: 0.5 }}>
                      {c.label}
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                      {c.val}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2.5}>
              {/* Donut: Free vs Paid (derived from plans) */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    background: brand.card,
                    borderRadius: 3,
                    border: `1px solid ${brand.border}`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography sx={{ color: brand.textDim, mb: 1.5 }}>
                    Free vs Paid
                  </Typography>
                  <Box sx={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          padAngle={2}
                          startAngle={90}
                          endAngle={-270}
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                        >
                          <Cell fill={brand.free} />
                          <Cell fill={brand.paid} />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#fbfbfcff",
                            border: `1px solid ${brand.border}`,
                            borderRadius: 10,
                            color: "white",
                          }}
                        />
                        <Legend
                          wrapperStyle={{ color: brand.textDim }}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Bar: Users by Plan */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    background: brand.card,
                    borderRadius: 3,
                    border: `1px solid ${brand.border}`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <Typography sx={{ color: brand.textDim, mb: 1.5 }}>
                    Users by Subscription Plan
                  </Typography>
                  <Box sx={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={barData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2b46" />
                        <XAxis tick={{ fill: "#d7d9ff" }} dataKey="name" />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#d7d9ff" }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#111325",
                            border: `1px solid ${brand.border}`,
                            borderRadius: 10,
                            color: "#fff",
                          }}
                        />
                        {/* Legend square matches bar color (no black) */}
                        <Legend
                          payload={[
                            {
                              value: "Users",
                              type: "square",
                              id: "usersLegend",
                              color: brand.bar,
                            },
                          ]}
                          wrapperStyle={{ color: brand.textDim }}
                        />
                        <Bar dataKey="count" name="Users" fill={brand.bar} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
