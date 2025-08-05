const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
  adminLogin,
} = require("../controllers/userController");
const { protectAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

// Admin routes (protected)
router.get("/", protectAdmin, getAllUsers);       // GET /api/users
router.delete("/:id", protectAdmin, deleteUser);  // DELETE /api/users/:id

module.exports = router;