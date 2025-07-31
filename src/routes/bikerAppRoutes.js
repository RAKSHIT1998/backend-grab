import express from 'express';
import {
  registerBiker,
  loginBiker,
  getProfile,
  updateProfile,
  toggleAvailability,
  getAssignedOrders,
  acceptOrder,
  rejectOrder,
  getOrder,
  updateOrderStatus,
  completeOrder,
  getCompletedOrders,
  getWallet,
  requestPayout,
  submitKyc,
  getNotifications,
  getRatings,
  addRatingFeedback,
} from '../controllers/bikerAppController.js';
import { protectDriver } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerBiker);
router.post('/login', loginBiker);
router.get('/profile', protectDriver, getProfile);
router.put('/profile/update', protectDriver, updateProfile);
router.patch('/availability', protectDriver, toggleAvailability);
router.post('/availability', protectDriver, toggleAvailability);
router.post('/kyc', protectDriver, submitKyc);

router.get('/orders/assigned', protectDriver, getAssignedOrders);
router.post('/orders/accept', protectDriver, acceptOrder);
router.post('/orders/reject', protectDriver, rejectOrder);
router.get('/orders/:orderId', protectDriver, getOrder);
router.patch('/orders/:orderId/status', protectDriver, updateOrderStatus);
router.post('/orders/:orderId/status', protectDriver, updateOrderStatus);
router.post('/orders/:orderId/complete', protectDriver, completeOrder);
router.get('/orders/completed', protectDriver, getCompletedOrders);

router.get('/wallet', protectDriver, getWallet);
router.post('/payout/request', protectDriver, requestPayout);
router.get('/notifications', protectDriver, getNotifications);
router.get('/ratings', protectDriver, getRatings);
router.post('/ratings/feedback', protectDriver, addRatingFeedback);

export default router;
