const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  commissionRate: { type: Number, default: 30 },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
  
  // Payment info
  paymentMethods: {
    bank: {
      enabled: { type: Boolean, default: false },
      bankName: { type: String },
      accountName: { type: String },
      accountNumber: { type: String }
    },
    telebirr: {
      enabled: { type: Boolean, default: false },
      phoneNumber: { type: String }
    },
    cbe: {
      enabled: { type: Boolean, default: false },
      accountNumber: { type: String },
      accountName: { type: String }
    },
    awash: {
      enabled: { type: Boolean, default: false },
      accountNumber: { type: String },
      accountName: { type: String }
    }
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema);
