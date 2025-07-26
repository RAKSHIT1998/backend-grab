// src/routes/bikeRoutes.js

import express from 'express';
import {
  bookBikeTaxi,
  createFoodBikeDelivery,
  createMartBikeDelivery,
  createPorterBikeDelivery,
  updateBikeLocation,
} from '../controllers/bikeController.js';

import { protectUser, protectDriver } from '../middleware/authMiddleware.js';

const router = express.Router();

// Bike Taxi
router.post('/bike-taxi/ride', protectUser, bookBikeTaxi);

// Food Delivery
router.post('/bike-delivery/food', protectUser, createFoodBikeDelivery);

// Mart Delivery
router.post('/bike-delivery/mart', protectUser, createMartBikeDelivery);

// Porter Delivery
router.post('/bike-delivery/porter', protectUser, createPorterBikeDelivery);

// Update live location for bike drivers
router.put('/location', protectDriver, updateBikeLocation);

export default router;
