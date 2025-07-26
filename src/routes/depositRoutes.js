import express from 'express';
import Deposit from '../models/depositModel.js';
import { protectDriver } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectDriver, async (req, res) => {
  try {
    const deposit = await Deposit.create({
      driverId: req.driver._id,
      amount: req.body.amount,
    });
    res.status(201).json(deposit);
  } catch (err) {
    res.status(500).json({ message: 'Deposit error' });
  }
});

export default router;
