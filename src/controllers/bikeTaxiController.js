// src/controllers/bikeTaxiController.js
import BikeTaxi from '../models/bikeTaxiModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new bike taxi order
// @route   POST /api/bike
// @access  Protected
export const createBikeTaxiOrder = asyncHandler(async (req, res) => {
  const { pickup, drop, distance, fare, paymentMode, notes } = req.body;
  const user = req.user._id;

  const order = await BikeTaxi.create({
    user,
    pickup,
    drop,
    distance,
    fare,
    paymentMode,
    notes,
    status: 'pending',
  });

  res.status(201).json(order);
});

// @desc    Get user bike taxi orders
// @route   GET /api/bike
// @access  Protected
export const getUserBikeTaxiOrders = asyncHandler(async (req, res) => {
  const orders = await BikeTaxi.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all bike taxi orders (Admin)
// @route   GET /api/admin/bike
// @access  Admin
export const getAllBikeTaxiOrders = asyncHandler(async (req, res) => {
  const orders = await BikeTaxi.find().populate('user', 'name email');
  res.json(orders);
});

// @desc    Update bike taxi order status
// @route   PUT /api/bike/:id/status
// @access  Protected (Driver/Admin)
export const updateBikeTaxiStatus = asyncHandler(async (req, res) => {
  const order = await BikeTaxi.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status || order.status;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
