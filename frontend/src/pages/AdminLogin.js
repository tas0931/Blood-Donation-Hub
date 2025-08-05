import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      const { token, user } = res.data;

      if (user.role !== "admin") {
        alert("Access denied. Not an admin.");
        return;
      }

      // Save session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Invalid credentials!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} component={Paper} p={4} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Login as Admin
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AdminLogin;
