import express from 'express';
const router = express.Router();
import Restaurant from '../models/restaurant.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Ride from '../models/Ride.js';

// Get all restaurants/users/orders/rides
router.get('/restaurants', async (req, res) => res.json(await Restaurant.find()));
router.get('/users', async (req, res) => res.json(await User.find()));
router.get('/orders', async (req, res) => res.json(await Order.find()));
router.get('/rides', async (req, res) => res.json(await Ride.find()));

// Approve/reject vendors/drivers
router.post('/verify-restaurant/:id', async (req, res) => {
  const r = await Restaurant.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
  res.json(r);
});
router.post('/verify-driver/:id', async (req, res) => {
  const Driver = (await import('../models/driverModel.js')).default;
  const d = await Driver.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
  res.json(d);
});

export default router;