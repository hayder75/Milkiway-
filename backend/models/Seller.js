const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  commissionRate: { type: Number, default: 30 },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);
