const Property = require('../models/Property');

const getProperties = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const properties = await Property.find(filter).sort('-createdAt');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, category, description, price, location, areaSqft, bedrooms, bathrooms, status, isFeatured, yearBuilt, garage, amenities } = req.body;
    let images = [];
    let thumbnail = '';
    
    if (req.files) {
      if (req.files.images) {
        images = req.files.images.map(file => `/uploads/${file.filename}`);
      }
      if (req.files.thumbnail && req.files.thumbnail.length > 0) {
        thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
    }

    const property = new Property({
      title, category, description, price, location, areaSqft, bedrooms, bathrooms, status, isFeatured, yearBuilt, garage, amenities, thumbnail, images
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    Object.assign(property, req.body);
    
    if (req.body.existingImages) {
      try {
        property.images = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error("Failed to parse existingImages", e);
      }
    }

    if (req.body.existingThumbnail !== undefined) {
      property.thumbnail = req.body.existingThumbnail;
    }
    
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const newImages = req.files.images.map(file => `/uploads/${file.filename}`);
        property.images = [...property.images, ...newImages];
      }
      if (req.files.thumbnail && req.files.thumbnail.length > 0) {
        property.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await Property.deleteOne({ _id: req.params.id });
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment likes for a property
const likeProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.likes = (property.likes || 0) + 1;
    await property.save();
    res.json({ likes: property.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, likeProperty };
