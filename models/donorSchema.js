const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
 firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  bloodType: { type: String, required: true },
  lastDonationDate: { type: String },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true }
});

module.exports = mongoose.model('Donor', donorSchema);