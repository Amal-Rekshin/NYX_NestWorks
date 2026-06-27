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
  thumbnail: { type: String }, // Separate thumbnail URL
  images: [{ type: String }], // Array of image URLs/paths
  yearBuilt: { type: Number },
  garage: { type: Number }, // Garage capacity (e.g., 2 cars)
  amenities: { type: String }, // Comma separated amenities
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
