// src/routes/driverRoutes.js

import express from 'express';
import Driver from '../models/driverModel.js';
import generateToken from '../utils/generateToken.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/drivers/register
// @desc    Register a new driver
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, vehicleType } = req.body;

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const driver = new Driver({ name, phone, email, password, vehicleType });
    await driver.save();

    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      token: generateToken(driver._id, 'driver'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/drivers/login
// @desc    Login driver and return token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (driver && (await driver.matchPassword(password))) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        token: generateToken(driver._id, 'driver'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/drivers/:id/status
// @desc    Toggle driver availability
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.active = !driver.active;
    await driver.save();

    res.json({ message: 'Status updated', active: driver.active });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/drivers/:id/location
// @desc    Update driver's live location
router.put('/:id/location', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.location = { latitude, longitude };
    await driver.save();

    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
