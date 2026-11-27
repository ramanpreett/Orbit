const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Meeting = require('../models/Meeting');

// Public route to get client portal data by magic link token
router.get('/:token', async (req, res) => {
  try {
    const client = await Client.findOne({ magicLinkToken: req.params.token });
    
    if (!client) {
      return res.status(404).json({ message: 'Invalid or expired portal link.' });
    }

    // Fetch related data for the portal
    const projects = await Project.find({ client: client._id }).sort({ createdAt: -1 });
    const invoices = await Invoice.find({ client: client._id }).sort({ createdAt: -1 });
    const meetings = await Meeting.find({ client: client._id }).sort({ date: 1 });

    res.json({
      client: {
        name: client.name,
        company: client.company,
        email: client.email
      },
      projects,
      invoices,
      meetings
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
