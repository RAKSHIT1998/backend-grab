const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/restaurant');
const Driver = require('../models/Driver');

// Place order
router.post('/', async (req, res) => {
  const { customerId, vendorId, items, address, location, type } = req.body;
  const restaurant = await Restaurant.findById(vendorId);
  if (!restaurant) return res.status(404).json({ error: "Vendor not found" });

  let total = 0;
  items.forEach(it => { total += it.price * (it.qty || 1); });
  let commission = total * 0.10;
  let gst = commission * 0.18;
  let deliveryFee = 17 + (location.distanceKm || 0) * 2; // or calculate based on distance
  // Optionally add surge fee logic here

  const order = new Order({
    customerId, vendorId, items, total, address, location,
    type, deliveryFee, commission, gst, status: "pending"
  });
  await order.save();
  res.json(order);
});

// Restaurant accepts order
router.post('/accept/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
  res.json(order);
});

// Restaurant marks as ready
router.post('/ready/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: "ready" }, { new: true });
  res.json(order);
});

// Assign rider (or driver accepts)
router.post('/assign/:id', async (req, res) => {
  const { riderId } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { riderId, status: "on the way" }, { new: true });
  res.json(order);
});

// Mark as delivered
router.post('/deliver/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: "delivered" }, { new: true });
  res.json(order);
});

// Get all orders for restaurant, customer, or rider
router.get('/vendor/:id', async (req, res) => {
  const orders = await Order.find({ vendorId: req.params.id });
  res.json(orders);
});
router.get('/customer/:id', async (req, res) => {
  const orders = await Order.find({ customerId: req.params.id });
  res.json(orders);
});
router.get('/rider/:id', async (req, res) => {
  const orders = await Order.find({ riderId: req.params.id });
  res.json(orders);
});

module.exports = router;