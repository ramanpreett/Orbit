const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');

// Get all clients for logged in user
router.get('/', auth, async (req, res) => {
  try {
    let clients = await Client.find({ user: req.user.id }).sort({ createdAt: -1 });
    let needsSave = false;
    
    // Auto-generate missing magic link tokens for legacy clients
    for (let client of clients) {
      if (!client.magicLinkToken) {
        client.magicLinkToken = crypto.randomBytes(16).toString('hex');
        await client.save();
        needsSave = true;
      }
    }

    const leanClients = needsSave ? await Client.find({ user: req.user.id }).sort({ createdAt: -1 }).lean() : clients.map(c => c.toObject());
    const projects = await Project.find({ user: req.user.id }).lean();
    
    const clientsWithProjects = leanClients.map(client => ({
      ...client,
      projects: projects.filter(p => p.client.toString() === client._id.toString())
    }));
    
    res.json(clientsWithProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new client
router.post('/', auth, async (req, res) => {
  const client = new Client({
    ...req.body,
    user: req.user.id,
    magicLinkToken: crypto.randomBytes(16).toString('hex')
  });
  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a client
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a client
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedClient) return res.status(404).json({ message: 'Client not found' });
    
    await Project.deleteMany({ client: req.params.id, user: req.user.id });
    await Invoice.deleteMany({ client: req.params.id, user: req.user.id });
    await Meeting.deleteMany({ client: req.params.id, user: req.user.id });
    
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
