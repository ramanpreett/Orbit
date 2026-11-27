const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Lead'], default: 'Active' },
  magicLinkToken: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
