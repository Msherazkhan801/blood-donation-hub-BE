const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// POST: Register a new thalassemia patient
router.post('/register', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: All patients (for donors to view)
router.get('/all', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ registrationDate: -1 });
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;