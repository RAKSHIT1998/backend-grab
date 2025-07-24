// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from './src/models/userModel.js';
import Driver from './src/models/driverModel.js';
import Restaurant from './src/models/restaurantModel.js';
import Mart from './src/models/martModel.js';
import Porter from './src/models/porterModel.js';

const JWT_SECRET = process.env.JWT_SECRET || '#479@/^5149*@123';

// Generic token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: Regular user
const protect = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.userDetails = user;
    next();
  });
};

// Middleware: Driver
const isDriver = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    req.driver = driver;
    next();
  });
};

// Middleware: Admin
const isAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    req.admin = user;
    next();
  });
};

// Middleware: Restaurant
const isRestaurant = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const rest = await Restaurant.findById(req.user.id);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });
    req.restaurant = rest;
    next();
  });
};

// Middleware: Mart
const isMart = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const mart = await Mart.findById(req.user.id);
    if (!mart) return res.status(404).json({ message: 'Mart partner not found' });
    req.mart = mart;
    next();
  });
};

// Middleware: Porter
const isPorter = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const porter = await Porter.findById(req.user.id);
    if (!porter) return res.status(404).json({ message: 'Porter not found' });
    req.porter = porter;
    next();
  });
};

// Middleware: Biker (subset of drivers)
const isBiker = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (!driver || driver.role !== 'biker') {
      return res.status(403).json({ message: 'Only bikers allowed' });
    }
    req.driver = driver;
    next();
  });
};

// Middleware: Taxi driver
const isTaxi = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (!driver || driver.role !== 'taxi') {
      return res.status(403).json({ message: 'Only taxi drivers allowed' });
    }
    req.driver = driver;
    next();
  });
};

export {
  protect,
  isDriver,
  isAdmin,
  isRestaurant,
  isMart,
  isPorter,
  isBiker,
  isTaxi,
};
