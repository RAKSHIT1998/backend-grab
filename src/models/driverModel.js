// src/controllers/driverController.js

import asyncHandler from 'express-async-handler';
import Driver from '../models/driverModel.js';
import generateToken from '../utils/generateToken.js';

// Register driver
export const registerDriver = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const driverExists = await Driver.findOne({ email });
  if (driverExists) {
    res.status(400);
    throw new Error('Driver already exists');
  }

  const driver = await Driver.create({ name, email, phone, password, role });
  if (driver) {
    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      token: generateToken(driver._id, driver.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid driver data');
  }
});

// Login driver
export const loginDriver = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findOne({ email });
  if (driver && (await driver.matchPassword(password))) {
    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      token: generateToken(driver._id, driver.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Get all drivers
export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

// Get single driver
export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (driver) {
    res.json(driver);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// Update driver
export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (driver) {
    driver.name = req.body.name || driver.name;
    driver.phone = req.body.phone || driver.phone;
    driver.isActive = req.body.isActive ?? driver.isActive;
    driver.role = req.body.role || driver.role;

    const updated = await driver.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// Delete driver
export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  res.json({ message: 'Driver deleted' });
});

// Toggle activity
export const toggleDriverActivity = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.user._id);
  if (driver) {
    driver.isActive = !driver.isActive;
    const updated = await driver.save();
    res.json({ isActive: updated.isActive });
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});
