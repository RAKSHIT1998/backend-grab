import express from 'express';
const router = express.Router();

// Start payment (stub, just marks as paid for demo)
router.post('/pay-order/:id', async (req, res) => {
  // In real use: integrate Razorpay, Stripe, Paytm, etc.
  const Order = (await import('../models/Order.js')).default;
  const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: "paid" }, { new: true });
  res.json({ success: true, order });
});

// Settlement (stub for admin to mark payout)
router.post('/settle/:id', async (req, res) => {
  // Settle order or ride
  res.json({ success: true, status: "settled" });
});

export default router;