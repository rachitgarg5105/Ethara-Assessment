const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../mock-auth');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For mock authentication, we'll create a mock user object
    // In a real app, you would find the user in the database
    const mockUser = {
      _id: decoded.id,
      name: 'Demo Admin',
      email: 'admin@demo.com',
      role: 'admin',
      isActive: true
    };
    
    if (!mockUser.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    req.user = mockUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = {
  protect,
  adminOnly,
  generateToken
};
