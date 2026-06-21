const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProperties)
  .post(protect, admin, upload.array('images', 5), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, admin, upload.array('images', 5), updateProperty)
  .delete(protect, admin, deleteProperty);

module.exports = router;
