const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createLead)
  .get(protect, admin, getLeads);

router.route('/:id/status')
  .put(protect, admin, updateLeadStatus);

module.exports = router;
