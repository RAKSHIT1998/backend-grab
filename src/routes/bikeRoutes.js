// src/routes/bikeRoutes.js

import express from 'express';
import {
  requestBikeTaxiRide,
  updateBikeTaxiStatus,
  getBikeTaxiHistory,
  requestFoodDelivery,
  updateFoodDeliveryStatus,
  getFoodDeliveryHistory,
  requestMartDelivery,
  updateMartDeliveryStatus,
  getMartDeliveryHistory,
  requestPorterDelivery,
  updatePorterDeliveryStatus,
  getPorterDeliveryHistory,
} from '../controllers/bikeController.js';

import { protect, bikeOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Bike Taxi
router.post('/bike-taxi/ride', protect, requestBikeTaxiRide);
router.put('/bike-taxi/status', protect, bikeOnly, updateBikeTaxiStatus);
router.get('/bike-taxi/history', protect, bikeOnly, getBikeTaxiHistory);

// Food Delivery
router.post('/bike-delivery/food', protect, requestFoodDelivery);
router.put('/bike-delivery/food/status', protect, bikeOnly, updateFoodDeliveryStatus);
router.get('/bike-delivery/food/history', protect, bikeOnly, getFoodDeliveryHistory);

// Mart Delivery
router.post('/bike-delivery/mart', protect, requestMartDelivery);
router.put('/bike-delivery/mart/status', protect, bikeOnly, updateMartDeliveryStatus);
router.get('/bike-delivery/mart/history', protect, bikeOnly, getMartDeliveryHistory);

// Porter Delivery
router.post('/bike-delivery/porter', protect, requestPorterDelivery);
router.put('/bike-delivery/porter/status', protect, bikeOnly, updatePorterDeliveryStatus);
router.get('/bike-delivery/porter/history', protect, bikeOnly, getPorterDeliveryHistory);

export default router;
