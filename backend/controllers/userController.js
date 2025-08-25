const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a user (donor, recipient, admin)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, dob, bloodGroup, location, mobile } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      dob,
      bloodGroup,
      location,
      mobile,
    });

    await user.save();
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login for all users
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Optional: Dedicated admin login (only if you want separate logic)
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Admin login failed" });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if bloodGroup query parameter is provided
    const { bloodGroup } = req.query;
    
    let query = {};
    
    // If bloodGroup is provided, add it to the query
    if (bloodGroup) {
      // Validate blood group
      const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({ error: "Invalid blood group" });
      }
      query.bloodGroup = bloodGroup;
    }
    
    const users = await User.find(query).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = req.user;
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Search recipients by blood group (for donors)
exports.searchRecipientsByBloodGroup = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    
    // Validate blood group
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: "Invalid blood group" });
    }
    
    // Find recipients with the specified blood group
    const recipients = await User.find({
      role: "recipient",
      bloodGroup: bloodGroup
    }).select("name email dob location mobile");
    
    res.status(200).json(recipients);
  } catch (err) {
    res.status(500).json({ error: "Failed to search recipients" });
  }
};

// Search donors by blood group (for recipients)
exports.searchDonorsByBloodGroup = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    
    // Validate blood group
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: "Invalid blood group" });
    }
    
    // Find donors with the specified blood group
    const donors = await User.find({
      role: "donor",
      bloodGroup: bloodGroup
    }).select("name email dob location mobile");
    
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to search donors" });
  }
};

// Get user statistics (public)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const donorCount = await User.countDocuments({ role: "donor" });
    const recipientCount = await User.countDocuments({ role: "recipient" });
    const adminCount = await User.countDocuments({ role: "admin" });
    
    res.status(200).json({
      totalUsers,
      donors: donorCount,
      recipients: recipientCount,
      admins: adminCount
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
};