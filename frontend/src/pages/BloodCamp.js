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
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
} from "@mui/material";

const BloodCamp = () => {
  const [camps, setCamps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");

  const fetchCamps = async (location = "") => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (location) {
        params.append("place", location);
      }
      
      const url = `http://localhost:5000/api/camps${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await axios.get(url);
      setCamps(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching camps:", err);
      setError(err.response?.data?.error || "Failed to load camps.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps(searchLocation);
  }, [searchLocation]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Blood Donation Camps</Typography>
      
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search by Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Enter location..."
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => fetchCamps(searchLocation)}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchLocation("");
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <Card>
          <CardContent>
            {camps.length === 0 ? (
              <Typography>No blood donation camps available at the moment.</Typography>
            ) : (
              <Paper elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Place</TableCell>
                      <TableCell>Description and Contacts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {camps.map(camp => (
                      <TableRow key={camp._id}>
                        <TableCell>{camp.name}</TableCell>
                        <TableCell>{new Date(camp.date).toLocaleDateString()}</TableCell>
                        <TableCell>{camp.place}</TableCell>
                        <TableCell>{camp.description || 'N/A'}</TableCell>
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

export default BloodCamp;