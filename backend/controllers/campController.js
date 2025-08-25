const BloodCamp = require("../models/BloodCamp");

// Create a new blood camp (admin only)
exports.createCamp = async (req, res) => {
  try {
    const { name, date, place, description } = req.body;
    
    const camp = new BloodCamp({
      name,
      date,
      place,
      description,
    });
    
    await camp.save();
    res.status(201).json({ message: "Blood camp created successfully", camp });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all blood camps (public)
exports.getAllCamps = async (req, res) => {
  try {
    // Check if place query parameter is provided
    const { place } = req.query;
    
    let query = {};
    
    // If place is provided, add it to the query (case insensitive)
    if (place) {
      query.place = { $regex: place, $options: 'i' }; // Case insensitive search
    }
    
    const camps = await BloodCamp.find(query).sort({ date: 1 }); // Sort by date ascending
    res.status(200).json(camps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blood camps" });
  }
};

// Delete a blood camp (admin only)
exports.deleteCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findByIdAndDelete(req.params.id);
    if (!camp) return res.status(404).json({ error: "Blood camp not found" });
    
    res.status(200).json({ message: "Blood camp deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting blood camp" });
  }
};