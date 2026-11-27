const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Get settings for logged in user
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({ user: req.user.id });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update settings
router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user.id });
    if (!settings) {
      settings = new Settings({ user: req.user.id, ...req.body });
    } else {
      settings.agencyName = req.body.agencyName ?? settings.agencyName;
      settings.logoUrl = req.body.logoUrl ?? settings.logoUrl;
      settings.hourlyRate = req.body.hourlyRate ?? settings.hourlyRate;
      settings.invoiceTerms = req.body.invoiceTerms ?? settings.invoiceTerms;
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
