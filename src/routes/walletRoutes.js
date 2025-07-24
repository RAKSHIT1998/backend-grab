// src/routes/walletRoutes.js
import express from 'express';
import {
  getWalletBalance,
  topUpWallet,
  withdrawFromWallet,
  getAllWallets,
  getUserWalletHistory,
} from '../controllers/walletController.js';

import { protect, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User wallet
router.get('/balance', protect, getWalletBalance);
router.post('/topup', protect, topUpWallet);
router.post('/withdraw', protect, withdrawFromWallet);
router.get('/history', protect, getUserWalletHistory);

// Admin route
router.get('/admin/all', protectAdmin, getAllWallets);

export default router;
