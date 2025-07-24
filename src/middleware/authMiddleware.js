// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Restaurant from '../models/restaurantModel.js';
import Mart from '../models/martModel.js';
import Porter from '../models/porterModel.js';
import Bike from '../models/bikeModel.js';
import Taxi from '../models/taxiModel.js';
import Admin from '../models/adminModel.js';

const secret = process.env.JWT_SECRET || '#479@/^5149*@123';

// Generic token verifier
const verifyToken = async (req, model) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    const user = await model.findById(decoded.id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }
  throw new Error('Not authorized, no token');
};

// Middlewares
const protectUser = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, User);
  next();
});

const protectDriver = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Driver);
  next();
});

const protectRestaurant = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Restaurant);
  next();
});

const protectMart = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Mart);
  next();
});

const protectPorter = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Porter);
  next();
});

const protectBike = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Bike);
  next();
});

const protectTaxi = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Taxi);
  next();
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  req.user = await verifyToken(req, Admin);
  next();
});

// Admin role check
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access denied');
  }
};

export {
  protectUser,
  protectDriver,
  protectRestaurant,
  protectMart,
  protectPorter,
  protectBike,
  protectTaxi,
  protectAdmin,
  isAdmin
};
