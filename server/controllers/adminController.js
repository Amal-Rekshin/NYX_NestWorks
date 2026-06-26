// server/controllers/adminController.js
const User = require('../models/User');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user by ID (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an admin user (admin only)
// @route   POST /api/admin/create-admin
// @access  Private/Admin
const createAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'admin',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Admin user created successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeLeads = await Lead.countDocuments({ status: { $ne: 'closed' } });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const ongoingConstruction = await Property.countDocuments({ status: 'ongoing' });
    
    const recentLeads = await Lead.find()
      .populate('propertyId', 'title')
      .sort('-createdAt')
      .limit(5);

    // Get counts by category for charts
    const categoryStats = await Property.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalProperties,
      activeLeads,
      soldProperties,
      ongoingConstruction,
      recentLeads,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, deleteUser, createAdmin, getDashboardStats };
