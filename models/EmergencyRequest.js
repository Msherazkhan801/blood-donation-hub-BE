const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  hospital: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  urgencyMinutes: {
    type: Number,
    required: true,
    enum: [1, 5, 10, 30],
  },
  urgencyLabel: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'accepted', 'expired'],
    default: 'active',
  },
  donorPhone: {
  type: String,
  default: null,
},
  acceptedBy: {
    type: String,
    default: null,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
});

// Virtual for checking if expired (based on current time)
emergencyRequestSchema.virtual('isExpired').get(function () {
  if (this.status !== 'active') return false;
  const elapsedMinutes = (Date.now() - this.createdAt.getTime()) / 1000 / 60;
  return elapsedMinutes >= this.urgencyMinutes;
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);