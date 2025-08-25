const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  adminLogin,
  getUserProfile,
  searchRecipientsByBloodGroup,
  searchDonorsByBloodGroup,
  getUserStats,
} = require("../controllers/userController");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.get("/stats", getUserStats);  // GET /api/users/stats

// Protected routes for all authenticated users
router.get("/profile", protect, getUserProfile);  // GET /api/users/profile
router.get("/search-recipients", protect, searchRecipientsByBloodGroup);  // GET /api/users/search-recipients
router.get("/search-donors", protect, searchDonorsByBloodGroup);  // GET /api/users/search-donors

// Admin routes (protected)
router.get("/", protectAdmin, getAllUsers);       // GET /api/users
router.delete("/:id", protectAdmin, deleteUser);  // DELETE /api/users/:id

module.exports = router;