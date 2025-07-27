import express from 'express';
import { getOrderHistory, getPaymentHistory, getLoginHistory } from '../controllers/historyController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protectUser);

router.get('/orders', getOrderHistory);
router.get('/payments', getPaymentHistory);
router.get('/logins', getLoginHistory);

export default router;
