import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Container, Typography } from '@mui/material';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    bloodGroup: '',
    location: '',
    mobile: '',
    role: 'donor',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", form); // Debug log
    try {
      await axios.post('http://localhost:5000/api/users/register', form);
      alert("Registration successful");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date of Birth"
          type="date"
          name="dob"
          value={form.dob}
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          required
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Blood Group"
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          required
        >
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <MenuItem key={bg} value={bg}>{bg}</MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          margin="normal"
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <MenuItem value="donor">Donor</MenuItem>
          <MenuItem value="recipient">Recipient</MenuItem>
        </TextField>
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;