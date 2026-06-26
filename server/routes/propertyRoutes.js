const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, likeProperty } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProperties)
  .post(protect, admin, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, admin, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]), updateProperty)
  .delete(protect, admin, deleteProperty);

// Like a property
router.post('/:id/like', protect, likeProperty);

module.exports = router;
