const mongoose = require("mongoose");

const bloodCampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  place: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("BloodCamp", bloodCampSchema);