const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['construction', 'plans', 'sales'], required: true },
  description: { type: String, required: true },
  price: { type: Number },
  location: { type: String },
  areaSqft: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  status: { type: String, enum: ['available', 'sold', 'ongoing', 'completed'], default: 'available' },
  images: [{ type: String }], // Array of image URLs/paths
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
