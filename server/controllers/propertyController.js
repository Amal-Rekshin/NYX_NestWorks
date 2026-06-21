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
    const { title, category, description, price, location, areaSqft, bedrooms, bathrooms, status, isFeatured } = req.body;
    let images = [];
    if (req.files) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const property = new Property({
      title, category, description, price, location, areaSqft, bedrooms, bathrooms, status, isFeatured, images
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
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      property.images = [...property.images, ...newImages];
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

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
