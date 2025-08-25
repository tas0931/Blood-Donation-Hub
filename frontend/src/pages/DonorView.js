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

const DonorView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ bloodGroup: "" });
  const [recipients, setRecipients] = useState([]);
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
      const params = new URLSearchParams({ bloodGroup: searchParams.bloodGroup });
      const res = await axios.get(`http://localhost:5000/api/users/search-recipients?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipients(res.data);
      setSearchPerformed(true);
    } catch (err) {
      console.error("Failed to search recipients", err);
      if (err.response) {
        alert(`Failed to search recipients: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        alert("Failed to search recipients: No response from server");
      } else {
        alert("Failed to search recipients: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4">Donor Dashboard</Typography>
        <p>Loading user information...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Donor Dashboard
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
            Search for Recipients
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
              Search Results ({recipients.length} found)
            </Typography>
            {recipients.length === 0 ? (
              <Typography>No recipients found with this blood type.</Typography>
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
                    {recipients.map((recipient) => (
                      <TableRow key={recipient._id}>
                        <TableCell>{recipient.name}</TableCell>
                        <TableCell>{recipient.dob ? new Date(recipient.dob).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{recipient.location || 'N/A'}</TableCell>
                        <TableCell>{recipient.email}</TableCell>
                        <TableCell>{recipient.mobile || 'N/A'}</TableCell>
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

export default DonorView;