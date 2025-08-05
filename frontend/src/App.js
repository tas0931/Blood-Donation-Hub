import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonorView from "./pages/DonorView";
import RecipientView from "./pages/RecipientView";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/donor" element={<DonorView />} />
        <Route path="/recipient" element={<RecipientView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </>
  );
}

export default App;
