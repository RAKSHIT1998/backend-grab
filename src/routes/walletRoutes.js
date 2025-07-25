// src/routes/walletRoutes.js
import express from 'express';
import {
  getWalletBalance,
  topUpWallet,
  withdrawFromWallet,
  getAllWallets,
  getUserWalletHistory,
} from '../controllers/walletController.js';

import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User wallet
router.get('/balance', protectUser, getWalletBalance);
router.post('/topup', protectUser, topUpWallet);
router.post('/withdraw', protectUser, withdrawFromWallet);
router.get('/history', protectUser, getUserWalletHistory);

// Admin route
router.get('/admin/all', protectAdmin, getAllWallets);

export default router;
