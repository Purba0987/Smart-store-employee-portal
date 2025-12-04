const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  aisle: Number,
  shelf: Number,
  addedAt: { type: Date, default: Date.now },
  aiRisk: { type: String, default: 'unknown' },
  daysToExpiry: { type: Number, default: null }
});

module.exports = mongoose.model('Product', productSchema);