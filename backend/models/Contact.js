const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  system: { type: mongoose.Schema.Types.ObjectId, ref: 'System' },
  systemName: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'completed', 'archived'], default: 'new' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
