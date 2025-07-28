import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';
import Restaurant from '../models/restaurantModel.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || '#479@/^5149*@123';

// Unified registration route
router.post('/register', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Account type required' });
    }

    if (type === 'user') {
      const { name, email, phone, password } = req.body;
      if (!name || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existing = await User.findOne({ $or: [{ email }, { phone }] });
      if (existing) {
        return res.status(400).json({ message: 'Account already exists' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, phone, password: hashed });
      const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
      return res.status(201).json({ token, user });
    }

    if (type === 'driver' || type === 'rider') {
      const { name, email, phone, password, vehicleType, licenseNumber, vehicleBrand, vehicleModel, vehicleNumber, photo } = req.body;
      const vehType = type === 'rider' ? 'bike' : vehicleType;
      if (!name || !phone || !password || !vehType || !licenseNumber || !vehicleNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existing = await Driver.findOne({ phone });
      if (existing) {
        return res.status(400).json({ message: 'Account already exists' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const driver = await Driver.create({
        name,
        email,
        phone,
        password: hashed,
        photo,
        vehicleType: vehType,
        vehicleBrand,
        vehicleModel,
        vehicleNumber,
        licenseNumber,
      });
      const token = jwt.sign({ id: driver._id, role: 'driver' }, SECRET);
      return res.status(201).json({ token, driver });
    }

    if (type === 'restaurant') {
      const { name, phone, email, password, location } = req.body;
      if (!name || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const existing = await Restaurant.findOne({ $or: [{ email }, { phone }] });
      if (existing) {
        return res.status(400).json({ message: 'Account already exists' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const restaurant = await Restaurant.create({
        name,
        phone,
        email,
        password: hashed,
        location,
      });
      const token = jwt.sign({ id: restaurant._id, role: 'restaurant' }, SECRET);
      return res.status(201).json({ token, restaurant });
    }

    res.status(400).json({ message: 'Invalid account type' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unified login route
router.post('/login', async (req, res) => {
  try {
    const { type, emailOrPhone, password } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Account type required' });
    }

    if (type === 'user') {
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
        return res.json({ token, user });
      }
    } else if (type === 'driver' || type === 'rider') {
      const driver = await Driver.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
      if (driver && (await driver.matchPassword(password))) {
        const token = jwt.sign({ id: driver._id, role: 'driver' }, SECRET);
        return res.json({ token, driver });
      }
    } else if (type === 'restaurant') {
      const restaurant = await Restaurant.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
      if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
        const token = jwt.sign({ id: restaurant._id, role: 'restaurant' }, SECRET);
        return res.json({ token, restaurant });
      }
    } else {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
