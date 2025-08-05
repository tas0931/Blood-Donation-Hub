import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
          maxWidth: 600,
          width: "100%",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#2f71d3ff", // Red color for blood donation theme
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