const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true 
  },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  dueDate: { type: String },
  progress: { type: Number, default: 0 },
  bg: { type: String },
  badgeColor: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
