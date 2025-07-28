// src/controllers/adminController.js
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Partner from '../models/partnerModel.js';
import Rating from '../models/ratingModel.js';
import Payout from '../models/payoutModel.js';
import Content from '../models/contentModel.js';
import Order from '../models/orderModel.js';
import Taxi from '../models/taxiModel.js';
import { sendPushNotification } from '../utils/notifier.js';
import jwt from 'jsonwebtoken';

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const drivers = await Driver.countDocuments();
    const partners = await Partner.countDocuments();
    const totalRatings = await Rating.countDocuments();
    const orders = await Order.countDocuments();
    const rides = await Taxi.countDocuments();

    const orderTotal = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const rideCommission = await Taxi.aggregate([
      { $group: { _id: null, total: { $sum: '$commission' } } },
    ]);

    const orderCommission = (orderTotal[0]?.total || 0) * 0.1;
    const totalRevenue = orderCommission + (rideCommission[0]?.total || 0);

    res.json({
      users,
      drivers,
      partners,
      totalRatings,
      orders,
      rides,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const approveDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    driver.isApproved = true;
    await driver.save();

    res.json({ message: 'Driver approved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const approvePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.isApproved = true;
    await partner.save();

    res.json({ message: 'Partner approved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate('user target');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const sendAdminNotification = async (req, res) => {
  try {
    const { to, title, body } = req.body;
    await sendPushNotification(to, title, body);
    res.json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ error: 'Notification failed' });
  }
};

export const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().populate('user');
    res.json(payouts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { page, content } = req.body;
    const updated = await Content.findOneAndUpdate({ page }, { content }, { upsert: true, new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Simple email/password based admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email === (process.env.ADMIN_EMAIL || 'rakshitbargotra@gmail.com') &&
    password === (process.env.ADMIN_PASSWORD || 'Rakshit@9858')
  ) {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET || '#479@/^5149*@123');
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};

// Calculate payouts for paid rides and orders
export const runAutomaticPayouts = async (req, res) => {
  try {
    const payouts = [];

    // Taxi driver payouts
    const rides = await Taxi.find({ isPaid: true, isPayoutDone: false });
    for (const ride of rides) {
      const amount = (ride.finalFare || ride.estimatedFare) - (ride.commission || 0);
      payouts.push(
        await Payout.create({
          amount,
          to: ride.driver,
          toRole: 'Driver',
          status: 'completed',
          processedAt: new Date(),
        })
      );
      ride.isPayoutDone = true;
      await ride.save();
    }

    // Restaurant order payouts
    const orders = await Order.find({ paymentStatus: 'Paid', isPayoutDone: false });
    for (const order of orders) {
      const amount = order.totalAmount * 0.9; // 10% commission retained
      payouts.push(
        await Payout.create({
          amount,
          to: order.restaurantId,
          toRole: 'Partner',
          status: 'completed',
          processedAt: new Date(),
        })
      );
      order.isPayoutDone = true;
      await order.save();
    }

    res.json({ processed: payouts.length });
  } catch (err) {
    res.status(500).json({ error: 'Payout processing failed' });
  }
};
