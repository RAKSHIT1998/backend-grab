// src/routes/adminRoutes.js
import express from 'express';
import {
  getAllUsers,
  getAllDrivers,
  getAllRestaurants,
  approveDriver,
  approveRestaurant,
  toggleUserActivity,
  getAllRatings,
  getAllPayoutRequests,
  processPayout,
  issueRefund,
  sendSystemNotification,
  updateContent,
  getDashboardStats,
  creditWallet,
} from '../controllers/adminController.js';

import { protectAdmin, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard stats
router.get('/dashboard', protectAdmin, isAdmin, getDashboardStats);

// Users & Drivers
router.get('/users', protectAdmin, isAdmin, getAllUsers);
router.get('/drivers', protectAdmin, isAdmin, getAllDrivers);
router.get('/restaurants', protectAdmin, isAdmin, getAllRestaurants);
router.put('/approve/driver/:id', protectAdmin, isAdmin, approveDriver);
router.put('/approve/restaurant/:id', protectAdmin, isAdmin, approveRestaurant);
router.put('/user/toggle/:id', protectAdmin, isAdmin, toggleUserActivity);

// Ratings/Feedback
router.get('/ratings', protectAdmin, isAdmin, getAllRatings);

// Payouts & Refunds
router.get('/payouts', protectAdmin, isAdmin, getAllPayoutRequests);
router.post('/payout/:id', protectAdmin, isAdmin, processPayout);
router.post('/refund/:orderId', protectAdmin, isAdmin, issueRefund);

// System Notifications
router.post('/notify', protectAdmin, isAdmin, sendSystemNotification);

// Content Editor (e.g. banners, announcements)
router.put('/content/:section', protectAdmin, isAdmin, updateContent);

// Credit Wallet
router.post('/wallet/credit/:userId', protectAdmin, isAdmin, creditWallet);

export default router;
