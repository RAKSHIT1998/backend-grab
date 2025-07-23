// src/routes/driverRoutes.js (ESM version)

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Driver from '../models/driverModel.js';

const router = express.Router();

// Register driver
router.post('/register', async (req, res) => {
  try {
    const driver = new Driver({ ...req.body, driverId: uuidv4() });
    await driver.save();
    res.status(201).json({ success: true, driver });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login driver
router.post('/login', async (req, res) => {
  try {
    const driver = await Driver.findOne({ phone: req.body.phone });
    if (!driver || driver.password !== req.body.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, driver });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle driver availability
router.patch('/:id/toggle', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    driver.active = !driver.active;
    await driver.save();
    res.json({ success: true, active: driver.active });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.json(driver);
  } catch (err) {
    res.status(404).json({ success: false, message: 'Driver not found' });
  }
});

export default router;
