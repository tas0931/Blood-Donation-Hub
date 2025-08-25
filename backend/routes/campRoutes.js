const express = require("express");
const router = express.Router();
const { createCamp, getAllCamps, deleteCamp } = require("../controllers/campController");
const { protectAdmin } = require("../middleware/authMiddleware");

// Public route to get all camps
router.get("/", getAllCamps);  // GET /api/camps

// Admin routes (protected)
router.post("/", protectAdmin, createCamp);  // POST /api/camps
router.delete("/:id", protectAdmin, deleteCamp);  // DELETE /api/camps/:id

module.exports = router;