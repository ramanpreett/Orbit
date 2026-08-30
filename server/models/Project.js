const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  dueDate: { type: String },
  progress: { type: Number, default: 0 },
  bg: { type: String },
  badgeColor: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
