// src/controllers/bikeController.js

import asyncHandler from 'express-async-handler';
import Ride from '../models/rideModel.js';
import Delivery from '../models/deliveryModel.js';
import User from '../models/userModel.js';

// POST /bike-taxi/ride
export const createBikeTaxiRide = asyncHandler(async (req, res) => {
  const { userId, pickupLocation, dropoffLocation, fareEstimate } = req.body;
  const ride = await Ride.create({
    type: 'bike-taxi',
    user: userId,
    pickupLocation,
    dropoffLocation,
    fare: fareEstimate,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: ride });
});

// POST /bike-delivery/food
export const createFoodDelivery = asyncHandler(async (req, res) => {
  const { userId, restaurantId, items, pickupLocation, dropoffLocation, totalPrice } = req.body;
  const delivery = await Delivery.create({
    type: 'food',
    user: userId,
    partner: restaurantId,
    items,
    pickupLocation,
    dropoffLocation,
    fare: totalPrice,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: delivery });
});

// POST /bike-delivery/mart
export const createMartDelivery = asyncHandler(async (req, res) => {
  const { userId, storeId, items, pickupLocation, dropoffLocation, totalPrice } = req.body;
  const delivery = await Delivery.create({
    type: 'mart',
    user: userId,
    partner: storeId,
    items,
    pickupLocation,
    dropoffLocation,
    fare: totalPrice,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: delivery });
});

// POST /bike-delivery/porter
export const createPorterDelivery = asyncHandler(async (req, res) => {
  const { userId, parcelDetails, pickupLocation, dropoffLocation, fareEstimate } = req.body;
  const delivery = await Delivery.create({
    type: 'porter',
    user: userId,
    parcelDetails,
    pickupLocation,
    dropoffLocation,
    fare: fareEstimate,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: delivery });
});
