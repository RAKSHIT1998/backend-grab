// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Porter from '../models/porterModel.js';
import Mart from '../models/martModel.js';
import Restaurant from '../models/restaurantModel.js';

const JWT_SECRET = process.env.JWT_SECRET || '#479@/^5149*@123';

// 🔐 General Token Auth
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

// 🔐 Admin Auth
export const protectAdmin = async (req, res, next) => {
  await protect(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (user?.role === 'admin') return next();
    res.status(403).json({ message: 'Access denied: Admin only' });
  });
};

// 🔐 Role-Based Protectors
export const isUser = async (req, res, next) => {
  await protect(req, res, async () => {
    const user = await User.findById(req.user.id);
    if (user?.role === 'user') return next();
    res.status(403).json({ message: 'Access denied: User only' });
  });
};

export const isDriver = async (req, res, next) => {
  await protect(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (driver) return next();
    res.status(403).json({ message: 'Access denied: Driver only' });
  });
};

export const isBiker = async (req, res, next) => {
  await protect(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (driver?.vehicleType === 'bike') return next();
    res.status(403).json({ message: 'Access denied: Biker only' });
  });
};

export const isTaxiDriver = async (req, res, next) => {
  await protect(req, res, async () => {
    const driver = await Driver.findById(req.user.id);
    if (driver?.vehicleType === 'taxi') return next();
    res.status(403).json({ message: 'Access denied: Taxi Driver only' });
  });
};

export const isPorter = async (req, res, next) => {
  await protect(req, res, async () => {
    const porter = await Porter.findById(req.user.id);
    if (porter) return next();
    res.status(403).json({ message: 'Access denied: Porter only' });
  });
};

export const isRestaurant = async (req, res, next) => {
  await protect(req, res, async () => {
    const restaurant = await Restaurant.findById(req.user.id);
    if (restaurant) return next();
    res.status(403).json({ message: 'Access denied: Restaurant only' });
  });
};

export const isMart = async (req, res, next) => {
  await protect(req, res, async () => {
    const mart = await Mart.findById(req.user.id);
    if (mart) return next();
    res.status(403).json({ message: 'Access denied: Mart only' });
  });
};
