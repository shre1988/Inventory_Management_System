const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  manufacturer: { type: String },
  partNumber: { type: String },
  description: { type: String },
  quantity: { type: Number, required: true, default: 0 },
  locationBin: { type: String },
  unitPrice: { type: Number },
  datasheetLink: { type: String },
  criticalThreshold: { type: Number, default: 0 },
  lastOutwardedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Component', ComponentSchema); 