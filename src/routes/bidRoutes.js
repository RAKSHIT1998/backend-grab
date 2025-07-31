import express from 'express';
import { createBid, acceptBid, getBidsByRide } from '../controllers/bidController.js';
import { protectDriver, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protectDriver, createBid);
router.post('/accept', protectUser, acceptBid);
router.get('/status/:rideId', protectUser, getBidsByRide);

export default router;
