import express from 'express';
import {
  loginDriver,
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleDriverAvailability,
  updateDriverLocation,
  getAllDrivers,
  approveDriver,
  deleteDriver,
  getOpenTaxiRequests,
  getActiveDriverRides,
  getDriverAnalytics,
} from '../controllers/driverController.js';
import { protectDriver, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.get('/profile', protectDriver, getDriverProfile);
router.put('/profile', protectDriver, updateDriverProfile);
router.patch('/availability', protectDriver, toggleDriverAvailability);
router.put('/location', protectDriver, updateDriverLocation);

// Taxi booking helpers for drivers
router.get('/taxi/requests', protectDriver, getOpenTaxiRequests);
router.get('/taxi/active', protectDriver, getActiveDriverRides);
router.get('/analytics', protectDriver, getDriverAnalytics);

// Admin routes
router.get('/', protectAdmin, getAllDrivers);
router.patch('/approve/:id', protectAdmin, approveDriver);
router.delete('/:id', protectAdmin, deleteDriver);

export default router;
