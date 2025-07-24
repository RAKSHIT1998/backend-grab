// src/routes/driverRoutes.js

import express from 'express';
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleDriverAvailability,
  getAllDrivers,
} from '../controllers/driverController.js';

import { protect, isDriver, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerDriver);
router.post('/login', loginDriver);

// Protected driver routes
router.get('/profile', protect, isDriver, getDriverProfile);
router.put('/profile', protect, isDriver, updateDriverProfile);
router.put('/toggle', protect, isDriver, toggleDriverAvailability);

// Admin-only routes
router.get('/all', protect, isAdmin, getAllDrivers);
router.delete('/:id', protect, isAdmin, deleteDriver);

export default router;
