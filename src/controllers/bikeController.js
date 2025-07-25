// src/controllers/bikeController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Driver from '../models/driverModel.js';
import { calculateFare } from '../utils/fareCalculator.js';

// Create Bike Taxi Booking
export const bookBikeTaxi = asyncHandler(async (req, res) => {
  const { userId, pickup, drop, estimatedMinutes } = req.body;

  const fare = calculateFare('bike', estimatedMinutes);
  const order = await Order.create({
    user: userId,
    type: 'bike_taxi',
    pickup,
    drop,
    estimatedMinutes,
    fare,
    status: 'requested',
  });

  res.status(201).json({ success: true, order });
});

// Bike Delivery - Food
export const createFoodBikeDelivery = asyncHandler(async (req, res) => {
  const { userId, restaurantId, items, pickup, drop, estimatedMinutes } = req.body;

  const fare = calculateFare('bike', estimatedMinutes);
  const order = await Order.create({
    user: userId,
    partner: restaurantId,
    type: 'bike_food',
    items,
    pickup,
    drop,
    estimatedMinutes,
    fare,
    status: 'requested',
  });

  res.status(201).json({ success: true, order });
});

// Bike Delivery - Mart
export const createMartBikeDelivery = asyncHandler(async (req, res) => {
  const { userId, martId, items, pickup, drop, estimatedMinutes } = req.body;

  const fare = calculateFare('bike', estimatedMinutes);
  const order = await Order.create({
    user: userId,
    partner: martId,
    type: 'bike_mart',
    items,
    pickup,
    drop,
    estimatedMinutes,
    fare,
    status: 'requested',
  });

  res.status(201).json({ success: true, order });
});

// Bike Delivery - Porter
export const createPorterBikeDelivery = asyncHandler(async (req, res) => {
  const { userId, porterId, description, pickup, drop, estimatedMinutes } = req.body;

  const fare = calculateFare('bike', estimatedMinutes);
  const order = await Order.create({
    user: userId,
    partner: porterId,
    type: 'bike_porter',
    description,
    pickup,
    drop,
    estimatedMinutes,
    fare,
    status: 'requested',
  });

  res.status(201).json({ success: true, order });
});
