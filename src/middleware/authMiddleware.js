// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Restaurant from '../models/restaurantModel.js';

// Middleware to protect user routes
export const protectUser = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to protect driver routes
export const protectDriver = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    const driver = await Driver.findById(decoded.id).select('-password');
    if (!driver) {
      res.status(401);
      throw new Error('Not authorized, driver not found');
    }

    req.driver = driver;
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to protect restaurant routes
export const protectRestaurant = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    const restaurant = await Restaurant.findById(decoded.id).select('-password');
    if (!restaurant) {
      res.status(401);
      throw new Error('Not authorized, restaurant not found');
    }

    req.restaurant = restaurant;
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin guard middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access required');
  }
};
