// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, createAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard stats
router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

// Users management
router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .delete(protect, admin, deleteUser);

// Create new admin user (protected, admin only)
router.route('/create-admin')
  .post(protect, admin, createAdmin);

// Placeholder for future property and lead admin routes
// router.route('/properties') ...
// router.route('/leads') ...

module.exports = router;
