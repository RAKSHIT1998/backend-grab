// src/controllers/porterController.js
import asyncHandler from 'express-async-handler';
import Porter from '../models/porterModel.js';
import Order from '../models/orderModel.js';

// Register Porter
export const registerPorter = asyncHandler(async (req, res) => {
  const { name, phone, password, vehicleNumber } = req.body;
  const porterExists = await Porter.findOne({ phone });

  if (porterExists) {
    res.status(400);
    throw new Error('Porter already exists');
  }

  const porter = await Porter.create({
    name,
    phone,
    password,
    vehicleNumber,
    isApproved: false,
    isActive: false,
  });

  if (porter) {
    res.status(201).json({ message: 'Porter registered. Awaiting approval.' });
  } else {
    res.status(400);
    throw new Error('Invalid porter data');
  }
});

// Login Porter
export const loginPorter = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const porter = await Porter.findOne({ phone });

  if (porter && (await porter.matchPassword(password))) {
    res.json({
      _id: porter._id,
      name: porter.name,
      token: porter.generateToken(),
      isApproved: porter.isApproved,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// Toggle Active Status
export const togglePorterActivity = asyncHandler(async (req, res) => {
  const porter = await Porter.findById(req.user.id);
  porter.isActive = !porter.isActive;
  await porter.save();
  res.json({ message: 'Activity toggled', active: porter.isActive });
});

// Get Orders Assigned to Porter
export const getMyPorterOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ porter: req.user.id });
  res.json(orders);
});

// Get Porter Earnings
export const getPorterEarnings = asyncHandler(async (req, res) => {
  const orders = await Order.find({ porter: req.user.id, isDelivered: true });
  const totalEarnings = orders.reduce((acc, order) => acc + order.deliveryCharge, 0);
  res.json({ totalOrders: orders.length, totalEarnings });
});

// Admin: Get All Porters
export const getAllPorters = asyncHandler(async (req, res) => {
  const porters = await Porter.find({});
  res.json(porters);
});

// Admin: Approve Porter
export const approvePorter = asyncHandler(async (req, res) => {
  const porter = await Porter.findById(req.params.id);
  if (porter) {
    porter.isApproved = true;
    await porter.save();
    res.json({ message: 'Porter approved' });
  } else {
    res.status(404);
    throw new Error('Porter not found');
  }
});
