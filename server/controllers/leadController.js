const Lead = require('../models/Lead');

const createLead = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;
    const lead = await Lead.create({ name, email, phone, message, propertyId });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('propertyId', 'title category').sort('-createdAt');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    lead.status = status || lead.status;
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLead, getLeads, updateLeadStatus };
