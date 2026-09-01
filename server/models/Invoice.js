const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceId: { type: String, required: true },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true 
  },
  amount: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
