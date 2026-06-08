const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const donorRoutes = require('./routes/user.js');
const patientRoutes = require('./routes/patients.js');
const emergencyRoutes = require('./routes/emergencyRequests.js');
require('dotenv').config();

const app = express();

// --- STEP 1: MIDDLEWARE FIRST ---
app.use(helmet()); 
app.use(cors());         // 1. Enable CORS before routes
app.use(express.json()); // 2. Enable JSON parsing before routes

// --- STEP 2: ROUTES SECOND ---
app.use('/api/donors', donorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/emergency', emergencyRoutes);
// --- STEP 3: DATABASE & SERVER ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Blood Donation Hub Database Connected Successfully"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});