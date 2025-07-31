import asyncHandler from 'express-async-handler';
import RefundRequest from '../models/refundRequestModel.js';
import Payment from '../models/paymentModel.js';

// User requests a refund
export const requestRefund = asyncHandler(async (req, res) => {
  const { orderId, amount, reason } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ message: 'orderId and amount are required' });
  }
  const refund = await RefundRequest.create({
    user: req.user._id,
    orderId,
    amount,
    reason,
  });
  res.status(201).json(refund);
});

// Get refunds for logged in user
export const getMyRefunds = asyncHandler(async (req, res) => {
  const refunds = await RefundRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(refunds);
});

// Admin processes pending refunds
export const runRefunds = asyncHandler(async (req, res) => {
  const pending = await RefundRequest.find({ status: 'pending' });
  let processed = 0;
  for (const reqRef of pending) {
    await Payment.findOneAndUpdate(
      { orderId: reqRef.orderId },
      { status: 'refunded', refundedAmount: reqRef.amount, refundReason: reqRef.reason }
    );
    reqRef.status = 'processed';
    reqRef.processedAt = new Date();
    await reqRef.save();
    processed++;
  }
  res.json({ processed });
});
