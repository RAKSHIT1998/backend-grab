const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const User = require('../models/User');
const Order = require('../models/Order');
const Ride = require('../models/Ride');

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
  const Driver = require('../models/Driver');
  const d = await Driver.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
  res.json(d);
});

module.exports = router;