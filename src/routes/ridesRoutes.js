const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Create ride request
router.post('/', async (req, res) => {
  const { customerId, source, destination, type } = req.body;
  const ride = new Ride({ customerId, source, destination, type, status: "pending" });
  await ride.save();
  res.json(ride);
});

// Driver bids on a ride
router.post('/bid/:id', async (req, res) => {
  const { driverId, amount } = req.body;
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ error: "Not found" });
  ride.bids.push({ driverId, amount, status: "bid" });
  await ride.save();
  res.json(ride);
});

// User accepts a bid
router.post('/accept/:id', async (req, res) => {
  const { driverId } = req.body;
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ error: "Not found" });
  const bid = ride.bids.find(b => b.driverId === driverId);
  if (!bid) return res.status(404).json({ error: "Bid not found" });
  ride.assignedDriver = driverId;
  ride.fare = bid.amount;
  ride.status = "assigned";
  await ride.save();
  res.json(ride);
});

// Mark as completed
router.post('/complete/:id', async (req, res) => {
  const ride = await Ride.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
  res.json(ride);
});

// Get all rides for customer/driver
router.get('/customer/:id', async (req, res) => {
  const rides = await Ride.find({ customerId: req.params.id });
  res.json(rides);
});
router.get('/driver/:id', async (req, res) => {
  const rides = await Ride.find({ assignedDriver: req.params.id });
  res.json(rides);
});
module.exports = router;
