// src/routes/notificationRoutes.js
import express from 'express';
const router = express.Router();

import {
  sendNotification,
  getUserNotifications,
  deleteNotification,
} from '../controllers/notificationController.js';

import { protectAdmin } from '../middleware/authMiddleware.js';

// Admin sends a notification (to user, driver, etc.)
router.post('/send', protectAdmin, sendNotification);

// Get all notifications (for admin or dashboard view)
router.get('/', protectAdmin, getUserNotifications);

// Delete a specific notification
router.delete('/:id', protectAdmin, deleteNotification);

export default router;
