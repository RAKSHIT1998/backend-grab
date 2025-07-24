// src/routes/fareRoutes.js
import express from 'express';
import {
  calculateBikeTaxiFare,
  calculatePorterFare,
  calculateMartDeliveryFare,
  calculateFoodDeliveryFare,
  getFareConfig,
  updateFareConfig,
} from '../controllers/fareController.js';
import { protectAdmin, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public fare estimation routes
router.post('/bike', calculateBikeTaxiFare);
router.post('/porter', calculatePorterFare);
router.post('/mart', calculateMartDeliveryFare);
router.post('/food', calculateFoodDeliveryFare);

// Admin: Get & Update fare configs
router.get('/config', protectAdmin, isAdmin, getFareConfig);
router.put('/config', protectAdmin, isAdmin, updateFareConfig);

export default router;
