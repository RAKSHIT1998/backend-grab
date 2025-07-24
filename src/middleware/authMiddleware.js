// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Restaurant from '../models/restaurantModel.js';
import Mart from '../models/martModel.js';
import Porter from '../models/porterModel.js';

const JWT_SECRET = process.env.JWT_SECRET || '#479@/^5149*@123';

// Generic token verification
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// User Auth Middleware
export const protectUser = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.userDetails = user;
    next();
  });
};

// Driver Auth Middleware
export const protectDriver = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    req.driver = driver;
    next();
  });
};

// Restaurant Auth Middleware
export const protectRestaurant = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    req.restaurant = restaurant;
    next();
  });
};

// Mart Partner Auth Middleware
export const protectMart = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const mart = await Mart.findById(req.user.id);
    if (!mart) return res.status(404).json({ message: 'Mart partner not found' });
    req.mart = mart;
    next();
  });
};

// Porter Partner Auth Middleware
export const protectPorter = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const porter = await Porter.findById(req.user.id);
    if (!porter) return res.status(404).json({ message: 'Porter not found' });
    req.porter = porter;
    next();
  });
};

// Admin-only middleware
export const protectAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    req.admin = user;
    next();
  });
};
