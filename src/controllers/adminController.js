// src/controllers/adminController.js
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Partner from '../models/partnerModel.js';
import Rating from '../models/ratingModel.js';
import Payout from '../models/payoutModel.js';
import Content from '../models/contentModel.js';
import { sendPushNotification } from '../utils/notifier.js';

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const drivers = await Driver.countDocuments();
    const partners = await Partner.countDocuments();
    const totalRatings = await Rating.countDocuments();
    res.json({ users, drivers, partners, totalRatings });
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
