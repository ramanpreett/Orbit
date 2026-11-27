const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  agencyName: { type: String, default: 'My Agency' },
  logoUrl: { type: String, default: '' },
  hourlyRate: { type: Number, default: 50 },
  invoiceTerms: { type: String, default: 'Payment due within 30 days.' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
