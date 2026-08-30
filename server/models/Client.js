const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Lead'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
