const express = require('express');
const router = express.Router();
const Donor = require('../models/donorSchema.js');

// POST: Register a new donor
router.post('/register', async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    const savedDonor = await newDonor.save();
    res.status(201).json({ message: "Registration successful!", data: savedDonor });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already registered." });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ registrationDate: -1 }); // Newest first
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;