import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Alert,
  CircularProgress,
  TextField,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [campForm, setCampForm] = useState({ name: "", date: "", place: "", description: "" });
  const [searchBloodType, setSearchBloodType] = useState("");

  const fetchUsers = async (bloodType = "") => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      if (bloodType) {
        params.append("bloodGroup", bloodType);
      }
      
      const url = `http://https://blood-donation-hub-backend.onrender.com/api/users${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCamps = async () => {
    try {
      const res = await axios.get("http://https://blood-donation-hub-backend.onrender.com/api/camps");
      setCamps(res.data);
    } catch (err) {
      console.error("Error fetching camps:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.delete(`http://https://blood-donation-hub-backend.onrender.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleCampDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.delete(`http://https://blood-donation-hub-backend.onrender.com/api/camps/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCamps();
    } catch (err) {
      console.error("Error deleting camp:", err);
      alert(err.response?.data?.error || "Failed to delete camp.");
    }
  };

  const handleCampChange = (e) => {
    setCampForm({ ...campForm, [e.target.name]: e.target.value });
  };

  const handleCampSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.post("http://https://blood-donation-hub-backend.onrender.com/api/camps", campForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampForm({ name: "", date: "", place: "", description: "" });
      fetchCamps();
    } catch (err) {
      console.error("Error creating camp:", err);
      alert(err.response?.data?.error || "Failed to create camp.");
    }
  };

  useEffect(() => {
    fetchUsers(searchBloodType);
    fetchCamps();
  }, [searchBloodType]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      {/* Camp Management Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add New Blood Donation Camp</Typography>
          <Box component="form" onSubmit={handleCampSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Camp Name"
                  name="name"
                  value={campForm.name}
                  onChange={handleCampChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={campForm.date}
                  onChange={handleCampChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Place"
                  name="place"
                  value={campForm.place}
                  onChange={handleCampChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description & Contacts"
                  name="description"
                  value={campForm.description}
                  onChange={handleCampChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Camp
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Camp List Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Blood Donation Camps</Typography>
          {camps.length === 0 ? (
            <Typography>No camps available.</Typography>
          ) : (
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Place</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {camps.map(camp => (
                    <TableRow key={camp._id}>
                      <TableCell>{camp.name}</TableCell>
                      <TableCell>{new Date(camp.date).toLocaleDateString()}</TableCell>
                      <TableCell>{camp.place}</TableCell>
                      <TableCell>{camp.description || 'N/A'}</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => handleCampDelete(camp._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>User Management</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Search by Blood Type"
              value={searchBloodType}
              onChange={(e) => setSearchBloodType(e.target.value)}
              placeholder="A+, B-, etc."
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={() => fetchUsers(searchBloodType)}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchBloodType("");
              }}
              disabled={loading}
              sx={{ ml: 1 }}
            >
              Clear
            </Button>
          </Box>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && (
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Blood Type</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.bloodGroup || 'N/A'}</TableCell>
                      <TableCell>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{user.mobile || 'N/A'}</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
