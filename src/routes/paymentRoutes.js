// src/routes/paymentRoutes.js
import express from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  simulateSuccess,
  issueRefund,
} from '../controllers/paymentController.js';

import { protect, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User: initiate Razorpay order
router.post('/create-order', protect, createOrder);

// Razorpay webhook
router.post('/webhook', handleWebhook); // public endpoint for Razorpay

// Optional: simulate success (for testing only)
router.post('/simulate-success', protect, simulateSuccess);

// Admin: initiate refund
router.post('/refund', protectAdmin, issueRefund);

// User: verify payment after frontend callback
router.post('/verify', protect, verifyPayment);

export default router;
