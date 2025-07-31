import express from 'express';
import { requestRefund, getMyRefunds, runRefunds } from '../controllers/refundController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectUser, requestRefund);
router.get('/my', protectUser, getMyRefunds);
router.post('/run', protectAdmin, runRefunds);

export default router;
