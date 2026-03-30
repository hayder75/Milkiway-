const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleId: { type: String, required: true, unique: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  system: { type: mongoose.Schema.Types.ObjectId, ref: 'System', required: true },
  systemName: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  buyerEmail: { type: String },
  salePrice: { type: Number, required: true },
  commissionPercent: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  companyEarnings: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
