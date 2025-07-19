const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'Token present' : 'No token');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret present' : 'No secret');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', user ? `User: ${user.username}` : 'No user found');
    
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    console.error('Error type:', error.name);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 