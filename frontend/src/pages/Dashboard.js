import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    donors: 0,
    recipients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://https://blood-donation-hub-backend.onrender.com/api/users/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch statistics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 6,
          padding: { xs: 3, sm: 5 },
          textAlign: "center",
          maxWidth: 900,
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#2f71d3ff",
            mb: 2,
          }}
        >
          Welcome to Blood Donation Hub
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontStyle: "italic",
            color: "#555",
            mb: 4,
          }}
        >
          "Stay fit, eat right, and donate blood"
        </Typography>

        {/* Statistics Cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Grid container spacing={3} justifyContent="center" maxWidth="md">
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#e3f2fd", textAlign: "center" }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {loading ? "..." : stats.totalUsers}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#555" }}>
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#ffebee", textAlign: "center" }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {loading ? "..." : stats.donors}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#555" }}>
                    Donors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#e8f5e9", textAlign: "center" }}>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#388e3c" }}
                  >
                    {loading ? "..." : stats.recipients}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#555" }}>
                    Recipients
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate("/register")}
            sx={{ px: 4, py: 1.5 }}
          >
            Join as Donor or Recipient
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ px: 4, py: 1.5 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
