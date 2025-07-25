// src/routes/fareRoutes.js
import express from 'express';
import { calculateFare } from '../controllers/fareController.js';

const router = express.Router();

// Public fare estimation routes
router.post('/bike', calculateFare);
router.post('/porter', calculateFare);
router.post('/mart', calculateFare);
router.post('/food', calculateFare);

export default router;
