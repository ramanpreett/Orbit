const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// Get all invoices for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).populate('client').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new invoice
router.post('/', auth, async (req, res) => {
  const invoice = new Invoice({
    ...req.body,
    user: req.user.id
  });
  try {
    const newInvoice = await invoice.save();
    await newInvoice.populate('client');
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('client');
    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
