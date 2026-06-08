const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
  },
  nextRequiredDate: {
    type: Date,
    required: [true, 'Next required date is required'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Patient', patientSchema);