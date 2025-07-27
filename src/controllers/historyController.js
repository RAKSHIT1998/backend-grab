import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';
import LoginHistory from '../models/loginHistoryModel.js';

// Get logged in user's order history
export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Get logged in user's payment history
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(payments);
});

// Get logged in user's login history
export const getLoginHistory = asyncHandler(async (req, res) => {
  const history = await LoginHistory.find({ user: req.user._id }).sort({ loggedInAt: -1 });
  res.json(history);
});
