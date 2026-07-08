const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const donorRoutes = require('./routes/user.js');
const patientRoutes = require('./routes/patients.js');
const emergencyRoutes = require('./routes/emergencyRequests.js');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/emergency', emergencyRoutes);



// --- STEP 3: DATABASE & SERVER ---
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Blood Donation Hub Database Connected Successfully"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});