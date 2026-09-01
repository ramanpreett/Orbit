const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: false // allowing false if some meetings are internal
  },
  date: { type: String, required: true },
  type: { type: String, default: 'Sync' },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
