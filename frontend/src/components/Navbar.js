import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Blood Donation Hub</Typography>
        <Box sx={{ ml: "auto" }}>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>

          {!user && (
            <>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/admin-login">Admin Login</Button> 
            </>
          )}

          {user?.role === "admin" && (
            <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
          )}
          {user?.role === "donor" && (
            <Button color="inherit" component={Link} to="/donor">Donor Dashboard</Button>
          )}
          {user?.role === "recipient" && (
            <Button color="inherit" component={Link} to="/recipient">Recipient Dashboard</Button>
          )}

          {user && (
            <Button color="inherit" onClick={logout}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
