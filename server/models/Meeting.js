const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, default: 'Sync' },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
