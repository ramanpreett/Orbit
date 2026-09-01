const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');

// Get all meetings for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user.id }).populate('client').sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new meeting
router.post('/', auth, async (req, res) => {
  const meeting = new Meeting({
    ...req.body,
    user: req.user.id
  });
  try {
    const newMeeting = await meeting.save();
    if (newMeeting.client) {
      await newMeeting.populate('client');
    }
    res.status(201).json(newMeeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a meeting
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('client');
    if (!updatedMeeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(updatedMeeting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a meeting
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedMeeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
