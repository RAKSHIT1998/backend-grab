// src/routes/paymentRoutes.js
import express from 'express';
import {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} from '../controllers/paymentController.js';

import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// User: initiate Razorpay order
router.post('/create-order', protectUser, createOrder);

// Razorpay webhook
router.post('/webhook', razorpayWebhook); // public endpoint for Razorpay

// User: verify payment after frontend callback
router.post('/verify', protectUser, verifyPayment);

export default router;
