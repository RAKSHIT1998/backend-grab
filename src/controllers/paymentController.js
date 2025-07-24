// src/controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/paymentModel.js';
import Wallet from '../models/walletModel.js';
import User from '../models/userModel.js';
import sendNotification from '../utils/notifier.js';
import sendSMS from '../utils/sms.js';
import sendEmail from '../utils/email.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });

    await Payment.create({
      user: req.user._id,
      amount,
      currency,
      receipt,
      orderId: order.id,
      status: 'created',
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const payment = await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: 'paid',
    },
    { new: true }
  );

  // Update user wallet balance
  await Wallet.findOneAndUpdate(
    { user: payment.user },
    { $inc: { balance: payment.amount } },
    { upsert: true }
  );

  // Notify user
  const user = await User.findById(payment.user);
  await sendNotification(user._id, `Payment of ₹${payment.amount} successful`);
  await sendSMS(user.phone, `₹${payment.amount} added to your wallet.`);
  await sendEmail(user.email, 'Payment Success', `₹${payment.amount} has been added.`);

  res.json({ success: true });
};

// Webhook for Razorpay
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (expected !== signature) return res.status(400).json({ error: 'Invalid webhook signature' });

  const event = req.body.event;
  if (event === 'payment.failed') {
    const failure = req.body.payload.payment.entity;
    await Payment.findOneAndUpdate(
      { paymentId: failure.id },
      { status: 'failed', failureReason: failure.error_reason || 'unknown' }
    );
  }

  res.json({ received: true });
};
