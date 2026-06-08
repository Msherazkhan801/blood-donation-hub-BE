const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');

// POST: Create a new emergency blood request
router.post('/create', async (req, res) => {
  try {
    const newRequest = new EmergencyRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json({ success: true, data: savedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: All active requests (not expired, not accepted)
router.get('/active', async (req, res) => {
  try {
    // Fetch active requests that haven't been accepted yet
    let requests = await EmergencyRequest.find({ status: 'active' }).sort({ createdAt: -1 });

    // Filter out expired ones based on current time
    const now = Date.now();
    const activeRequests = requests.filter(req => {
      const elapsedMinutes = (now - req.createdAt.getTime()) / 1000 / 60;
      return elapsedMinutes < req.urgencyMinutes;
    });

    // Optionally mark expired ones in DB (background job can be added later)
    res.status(200).json({ success: true, count: activeRequests.length, data: activeRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: All requests (for admin/history)
router.get('/all', async (req, res) => {
  try {
    const requests = await EmergencyRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Accept a request (donor helps)
// PUT: Accept a request (donor helps)
router.put('/accept/:id', async (req, res) => {
  try {
    const { donorName, donorPhone } = req.body;
    if (!donorName || !donorPhone) {
      return res.status(400).json({ success: false, message: 'Donor name and phone are required' });
    }

    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Request is no longer active' });
    }

    // Check expiration again
    const elapsedMinutes = (Date.now() - request.createdAt.getTime()) / 1000 / 60;
    if (elapsedMinutes >= request.urgencyMinutes) {
      request.status = 'expired';
      await request.save();
      return res.status(400).json({ success: false, message: 'Request has expired' });
    }

    request.status = 'accepted';
    request.acceptedBy = donorName;
    request.donorPhone = donorPhone;        // <-- new field
    request.acceptedAt = Date.now();
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Optional: manual expire old requests (can be called via cron job)
router.put('/expire-old', async (req, res) => {
  try {
    const activeRequests = await EmergencyRequest.find({ status: 'active' });
    const now = Date.now();
    let expiredCount = 0;
    for (const req of activeRequests) {
      const elapsedMinutes = (now - req.createdAt.getTime()) / 1000 / 60;
      if (elapsedMinutes >= req.urgencyMinutes) {
        req.status = 'expired';
        await req.save();
        expiredCount++;
      }
    }
    res.status(200).json({ success: true, expiredCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;