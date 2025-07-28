// src/routes/adminRoutes.js
import express from 'express';
import {
  getDashboardStats,
  approveDriver,
  approvePartner,
  getAllRatings,
  sendAdminNotification,
  updateContent,
  adminLogin,
  runAutomaticPayouts,
  getAllPayouts,
} from '../controllers/adminController.js';

import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin login
router.post('/login', adminLogin);

// Admin Dashboard stats
router.get('/dashboard', protectAdmin, getDashboardStats);

// Users & Drivers
router.put('/approve/driver/:id', protectAdmin, approveDriver);
router.put('/approve/restaurant/:id', protectAdmin, approvePartner);

// Ratings/Feedback
router.get('/ratings', protectAdmin, getAllRatings);

// Send Admin Notification
router.post('/notify', protectAdmin, sendAdminNotification);

// Content Editor (e.g. banners, announcements)
router.put('/content/:section', protectAdmin, updateContent);

// View all payouts
router.get('/payouts', protectAdmin, getAllPayouts);

// Trigger payout processing
router.post('/payouts/run', protectAdmin, runAutomaticPayouts);

export default router;
