// src/controllers/bikeController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Driver from '../models/driverModel.js';
import { calculateFare } from '../utils/fareCalculator.js';
import { getIO } from '../socket/socket.js';

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

  const io = getIO();
  if (io) {
    io.of('/driver').emit('bike-taxi-request', {
      orderId: order._id,
      userId,
      pickup,
      drop,
    });
  }

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

  const io = getIO();
  if (io) {
    io.of('/driver').emit('food-delivery-request', {
      orderId: order._id,
      userId,
      restaurantId,
      pickup,
      drop,
    });
  }

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

  const io = getIO();
  if (io) {
    io.of('/driver').emit('mart-delivery-request', {
      orderId: order._id,
      userId,
      martId,
      pickup,
      drop,
    });
  }

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

  const io = getIO();
  if (io) {
    io.of('/driver').emit('porter-request', {
      orderId: order._id,
      userId,
      porterId,
      pickup,
      drop,
    });
  }

  res.status(201).json({ success: true, order });
});

// Bike Delivery - Medicine
export const createMedicineBikeDelivery = asyncHandler(async (req, res) => {
  const { userId, pharmacyId, items, pickup, drop, estimatedMinutes } = req.body;

  const fare = calculateFare('bike', estimatedMinutes);
  const order = await Order.create({
    user: userId,
    partner: pharmacyId,
    type: 'bike_medicine',
    items,
    pickup,
    drop,
    estimatedMinutes,
    fare,
    status: 'requested',
  });

  const io = getIO();
  if (io) {
    io.of('/driver').emit('medicine-delivery-request', {
      orderId: order._id,
      userId,
      pharmacyId,
      pickup,
      drop,
    });
  }

  res.status(201).json({ success: true, order });
});

// Update Bike Driver Location
export const updateBikeLocation = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ _id: req.driver._id, vehicleType: 'bike' });
  if (!driver) {
    return res.status(404).json({ message: 'Bike driver not found' });
  }

  driver.location = {
    lat: req.body.lat,
    lng: req.body.lng,
    updatedAt: new Date(),
  };

  await driver.save();
  res.json({ message: 'Bike location updated' });
});
