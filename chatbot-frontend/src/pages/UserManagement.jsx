// src/pages/UserManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";

const API_BASE = "http://127.0.0.1:8000/api";

// keep visuals consistent with Analytics
const brand = {
  bg:
    "radial-gradient(1200px 500px at 20% -10%, #161233 0%, #0f1433 35%, #0e1431 60%, #0c1734 85%, #0b1837 100%)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  textDim: "#c9c8ff",
  accent:
    "linear-gradient(90deg, #ff58a6 0%, #ff7cb9 20%, #c17cff 60%, #7ea6ff 100%)",
};

const ROWS_PER_PAGE = 4;

const normalizePlanName = (name) => {
  const s = (name || "").trim();
  if (!s) return "Free";
  if (/^free$/i.test(s)) return "Free";
  if (/pro/i.test(s)) return "Pro";
  if (/premium/i.test(s)) return "Premium";
  return s;
};

export default function UserManagement() {
  const token = useMemo(() => sessionStorage.getItem("userToken") || "", []);
  const role = useMemo(
    () => (sessionStorage.getItem("userRole") || "").toLowerCase(),
    []
  );
  const isAdmin = role === "admin";

  // UI/FX
  const [typedTitle, setTypedTitle] = useState("");
  useEffect(() => {
    const full = "User Management";
    let i = 0;
    const id = setInterval(() => {
      setTypedTitle(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  // data & state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [subscriptions, setSubscriptions] = useState([]); // [{id,name}]
  const [users, setUsers] = useState([]); // unified shape

  // controls
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all"); // "all" | "free" | <id>
  const [sortBy, setSortBy] = useState("name"); // name | email | created_at | plan | role
  const [sortDir, setSortDir] = useState("asc"); // asc | desc
  const [page, setPage] = useState(1); // 1-based

  // fetch plans + users
  useEffect(() => {
    if (!token) {
      setErr("Missing auth token.");
      setLoading(false);
      return;
    }

    let alive = true;

    const load = async () => {
      try {
        // 1) plans for filter
        const subRes = await fetch(`${API_BASE}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const subJson = await subRes.json().catch(() => ({}));
        const subs =
          (Array.isArray(subJson?.data) ? subJson.data : subJson) || [];
        const subsMapped = subs.map((s) => ({
          id: s.id,
          name: normalizePlanName(s.name),
        }));

        // 2) users
        const uRes = await fetch(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!uRes.ok) {
          throw new Error(`${uRes.status} ${await uRes.text()}`);
        }
        const uJson = await uRes.json();
        const list = Array.isArray(uJson?.users) ? uJson.users : [];

        // build a map for id->name
        const map = new Map(subsMapped.map((s) => [Number(s.id), s.name]));

        // unify fields
        const unified = list.map((u) => {
          const subName =
            normalizePlanName(
              u?.subscription?.name ??
                (u?.subscription_name || null) ??
                (u?.subscription_id ? map.get(Number(u.subscription_id)) : null)
            ) || "Free";
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.user_role,
            planName: subName,
            subscription_id:
              u?.subscription_id != null ? Number(u.subscription_id) : null,
            created_at: u.created_at || "",
          };
        });

        if (!alive) return;
        setSubscriptions(subsMapped);
        setUsers(unified);
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load users.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  // derived -> filtered, sorted, paginated
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    let rows = users.filter((u) => {
      // search in name OR email
      const matchesSearch =
        !s ||
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s);

      // plan filter
      let matchesPlan = true;
      if (planFilter === "free") {
        matchesPlan = !u.subscription_id && u.planName === "Free";
      } else if (planFilter !== "all") {
        // numeric id string
        matchesPlan = Number(u.subscription_id) === Number(planFilter);
      }

      return matchesSearch && matchesPlan;
    });

    // sort
    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const get = (o) => {
        switch (sortBy) {
          case "name":
            return (o.name || "").toLowerCase();
          case "email":
            return (o.email || "").toLowerCase();
          case "plan":
            return (o.planName || "").toLowerCase();
          case "role":
            return (o.role || "").toLowerCase();
          case "created_at":
            return o.created_at || "";
          default:
            return (o.name || "").toLowerCase();
        }
      };
      const av = get(a);
      const bv = get(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    return rows;
  }, [users, search, planFilter, sortBy, sortDir]);

  // pagination (4 per page)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice(
    (pageSafe - 1) * ROWS_PER_PAGE,
    pageSafe * ROWS_PER_PAGE
  );

  const resetFilters = () => {
    setSearch("");
    setPlanFilter("all");
    setSortBy("name");
    setSortDir("asc");
    setPage(1);
  };

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const deleteUser = async (id) => {
    const yes = window.confirm("Delete this user? This action is permanent.");
    if (!yes) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`${res.status} ${txt}`);
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete user.");
    }
  };

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
        {/* Header with neon gradient + typewriter */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: { xs: 32, md: 48 },
            mb: 3,
            background: brand.accent,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0 0 12px rgba(255, 88, 166, .55), 0 0 28px rgba(193,124,255,.45)",
          }}
        >
          {typedTitle}
        </Typography>

        {/* Controls */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            background: brand.card,
            borderRadius: 3,
            border: `1px solid ${brand.border}`,
            backdropFilter: "blur(6px)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                InputLabelProps={{ style: { color: brand.textDim } }}
                inputProps={{ style: { color: "#fff" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: brand.border },
                    "&:hover fieldset": { borderColor: brand.textDim },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: brand.textDim }}>
                  Filter by plan
                </InputLabel>
                <Select
                  label="Filter by plan"
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setPage(1);
                  }}
                  sx={{
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: brand.border,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: brand.textDim,
                    },
                  }}
                >
                  <MenuItem value="all">All plans</MenuItem>
                  {subscriptions.map((s) => (
                    <MenuItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: brand.textDim }}>
                  Sort column
                </InputLabel>
                <Select
                  label="Sort column"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: brand.border,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: brand.textDim,
                    },
                  }}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="plan">Plan</MenuItem>
                  <MenuItem value="role">Role</MenuItem>
                  <MenuItem value="created_at">Created</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
                startIcon={<SortIcon />}
                sx={{
                  height: "56px",
                  width: "100%",
                  color: "#fff",
                  background: brand.accent,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { filter: "brightness(1.05)" },
                }}
              >
                {sortDir === "asc" ? "Asc" : "Desc"}
              </Button>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={resetFilters}
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderColor: brand.textDim,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": { borderColor: "#fff" },
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            p: 0,
            background: brand.card,
            borderRadius: 3,
            border: `1px solid ${brand.border}`,
            overflow: "hidden",
            backdropFilter: "blur(6px)",
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : err ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {err}
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          color: "#fff",
                        },
                      }}
                    >
                      <TableCell
                        onClick={() => toggleSort("name")}
                        sx={{ cursor: "pointer", width: "22%" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        onClick={() => toggleSort("email")}
                        sx={{ cursor: "pointer", width: "26%" }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        onClick={() => toggleSort("plan")}
                        sx={{ cursor: "pointer", width: "18%" }}
                      >
                        Plan
                      </TableCell>
                      <TableCell
                        onClick={() => toggleSort("role")}
                        sx={{ cursor: "pointer", width: "14%" }}
                      >
                        Role
                      </TableCell>
                      <TableCell
                        onClick={() => toggleSort("created_at")}
                        sx={{ cursor: "pointer", width: "14%" }}
                      >
                        Created
                      </TableCell>
                      <TableCell align="center" sx={{ width: "6%" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          No users match your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((u) => (
                        <TableRow key={u.id} hover>
                          <TableCell sx={{ color: "#fff" }}>{u.name}</TableCell>
                          <TableCell sx={{ color: "#fff" }}>{u.email}</TableCell>
                          <TableCell sx={{ color: "#fff" }}>{u.planName}</TableCell>
                          <TableCell sx={{ textTransform: "capitalize", color: "#fff" }}>
                            {u.role}
                          </TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Delete user">
                              <IconButton
                                onClick={() => deleteUser(u.id)}
                                size="small"
                                sx={{ color: "#ff7cb9" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ borderColor: brand.border }} />

              {/* Pagination (4 per page, no rows-per-page selector) */}
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={pageSafe}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": { color: "#fff" },
                    "& .Mui-selected": {
                      background:
                        "linear-gradient(90deg,#ff58a6,#c17cff,#7ea6ff)",
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
