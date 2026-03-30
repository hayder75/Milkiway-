const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  video: { type: String },
  price: { type: Number, default: 0 },
  features: [{ type: String }],
  category: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('System', systemSchema);
