import express from 'express';
import {
  loginDriver,
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleDriverAvailability,
  getAllDrivers,
  approveDriver,
  deleteDriver,
} from '../controllers/driverController.js';
import { protectDriver, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.get('/profile', protectDriver, getDriverProfile);
router.put('/profile', protectDriver, updateDriverProfile);
router.patch('/availability', protectDriver, toggleDriverAvailability);

// Admin routes
router.get('/', protectAdmin, getAllDrivers);
router.patch('/approve/:id', protectAdmin, approveDriver);
router.delete('/:id', protectAdmin, deleteDriver);

export default router;
