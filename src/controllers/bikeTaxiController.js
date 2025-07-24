// backend-grab/src/controllers/bikeController.js

import asyncHandler from 'express-async-handler';
import BikeBooking from '../models/bikeBookingModel.js';
import Order from '../models/orderModel.js'; // Assuming food and mart use this
import PorterOrder from '../models/porterModel.js'; // Porter model

// 1. Bike Taxi Booking
export const createBikeTaxiBooking = asyncHandler(async (req, res) => {
  const { pickup, drop, user, fare } = req.body;
  const booking = await BikeBooking.create({ type: 'bike-taxi', pickup, drop, user, fare });
  res.status(201).json({ success: true, booking });
});

// 2. Food Delivery Order (Bike based)
export const createFoodDeliveryOrder = asyncHandler(async (req, res) => {
  const { items, restaurantId, userId, address, totalAmount } = req.body;
  const order = await Order.create({ type: 'food', items, restaurantId, userId, address, totalAmount, mode: 'bike' });
  res.status(201).json({ success: true, order });
});

// 3. Mart Delivery Order (Bike based)
export const createMartDeliveryOrder = asyncHandler(async (req, res) => {
  const { items, storeId, userId, address, totalAmount } = req.body;
  const order = await Order.create({ type: 'mart', items, storeId, userId, address, totalAmount, mode: 'bike' });
  res.status(201).json({ success: true, order });
});

// 4. Porter Booking
export const createPorterDelivery = asyncHandler(async (req, res) => {
  const { pickup, drop, loadType, user, fare } = req.body;
  const porter = await PorterOrder.create({ pickup, drop, loadType, user, fare, mode: 'bike' });
  res.status(201).json({ success: true, porter });
});

// Get all bookings by user
export const getAllBikeBookings = asyncHandler(async (req, res) => {
  const bookings = await BikeBooking.find({ user: req.user._id });
  res.json(bookings);
});

// Get specific booking
export const getBikeBookingById = asyncHandler(async (req, res) => {
  const booking = await BikeBooking.findById(req.params.id);
  if (!booking) throw new Error('Booking not found');
  res.json(booking);
});
