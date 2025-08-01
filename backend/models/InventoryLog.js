const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  componentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Component', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, enum: ['inward', 'outward'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema); 