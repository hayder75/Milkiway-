const mongoose = require('mongoose');

const payoutRequestSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['bank', 'telebirr', 'cbe', 'awash'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'rejected'], 
    default: 'pending' 
  },
  note: { type: String },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PayoutRequest', payoutRequestSchema);