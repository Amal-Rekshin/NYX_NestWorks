const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    // NOTE: In this architecture, the frontend uses Firebase Phone Authentication
    // to verify the phone number BEFORE hitting this endpoint. 
    // Once Firebase confirms the OTP, the frontend calls this to create the DB user.

    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({ name, email, password, phone, role });
    
    res.status(201).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      role: user.role, 
      token: generateToken(user._id) 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role, 
        token: generateToken(user._id) 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
