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

// -------------------- Database connection (cached) --------------------
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('✅ Using cached DB connection');
    return cachedDb;
  }

  // Guard against missing environment variable
  if (!process.env.MONGO_URL) {
    throw new Error('❌ MONGO_URL environment variable is not set.');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 1, // Recommended for serverless
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
    });
    cachedDb = conn;
    console.log('✅ MongoDB connected (new)');
    return cachedDb;
  } catch (err) {
    console.error('❌ DB connection error:', err);
    throw err; // re-throw so the function fails and logs the error
  }
}

// -------------------- Vercel serverless handler --------------------
module.exports = async (req, res) => {
  try {
    await connectToDatabase(); // ensure DB is connected
    return app(req, res);      // let Express handle the request
  } catch (err) {
    // This catches any error from DB or Express and returns a clear response
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
      // In production you may want to hide stack trace, but it's helpful for debugging
      stack: err.stack,
    });
  }
};

// -------------------- Local development (optional) --------------------
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server flying on port ${PORT}`);
  });
}