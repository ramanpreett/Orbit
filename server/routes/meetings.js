const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new meeting
router.post('/', async (req, res) => {
  const meeting = new Meeting(req.body);
  try {
    const newMeeting = await meeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
