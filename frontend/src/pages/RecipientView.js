import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import axios from "axios";
import { getToken } from "../utils/auth";

const RecipientView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ bloodGroup: "" });
  const [donors, setDonors] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      console.log("Token value:", token); // Simple debugging line
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }
      // Use URLSearchParams to properly encode the blood group parameter
      const params = new URLSearchParams({ bloodGroup: searchParams.bloodGroup });
      const res = await axios.get(`http://localhost:5000/api/users/search-donors?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonors(res.data);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Failed to search donors", err);
      // Provide more detailed error information
      if (err.response) {
        alert(`Failed to search donors: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        alert("Failed to search donors: No response from server");
      } else {
        alert("Failed to search donors: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4">Recipient Dashboard</Typography>
        <p>Loading user information...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recipient Dashboard
      </Typography>
      
      {user && (
        <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Name</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Blood Type</Typography>
              <Typography variant="body1">{user.bloodGroup}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Role</Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      )}
      
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search for Donors
          </Typography>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <FormControl fullWidth>
              <InputLabel>Blood Type</InputLabel>
              <Select
                name="bloodGroup"
                value={searchParams.bloodGroup}
                onChange={handleSearchChange}
                label="Blood Type"
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      {searchPerformed && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results ({donors.length} found)
            </Typography>
            {donors.length === 0 ? (
              <Typography>No donors found with this blood type.</Typography>
            ) : (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow key={donor._id}>
                        <TableCell>{donor.name}</TableCell>
                        <TableCell>{donor.dob ? new Date(donor.dob).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{donor.location || 'N/A'}</TableCell>
                        <TableCell>{donor.email}</TableCell>
                        <TableCell>{donor.mobile || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RecipientView;