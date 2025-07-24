// src/controllers/driverController.js

import Driver from '../models/driverModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc    Register new driver
// @route   POST /api/drivers/register
// @access  Public
export const registerDriver = asyncHandler(async (req, res) => {
  const { name, email, phone, password, vehicleType, licenseNumber } = req.body;

  const driverExists = await Driver.findOne({ email });

  if (driverExists) {
    res.status(400);
    throw new Error('Driver already exists');
  }

  const driver = await Driver.create({
    name,
    email,
    phone,
    password,
    vehicleType,
    licenseNumber,
  });

  if (driver) {
    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      role: 'driver',
      token: generateToken(driver._id, 'driver'),
    });
  } else {
    res.status(400);
    throw new Error('Invalid driver data');
  }
});

// @desc    Auth driver & get token
// @route   POST /api/drivers/login
// @access  Public
export const authDriver = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findOne({ email });

  if (driver && (await driver.matchPassword(password))) {
    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      role: 'driver',
      token: generateToken(driver._id, 'driver'),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private
export const getDriverProfile = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.driver._id).select('-password');

  if (driver) {
    res.json(driver);
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Update driver profile
// @route   PUT /api/drivers/profile
// @access  Private
export const updateDriverProfile = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.driver._id);

  if (driver) {
    driver.name = req.body.name || driver.name;
    driver.phone = req.body.phone || driver.phone;
    driver.vehicleType = req.body.vehicleType || driver.vehicleType;
    driver.licenseNumber = req.body.licenseNumber || driver.licenseNumber;

    if (req.body.password) {
      driver.password = req.body.password;
    }

    const updatedDriver = await driver.save();

    res.json({
      _id: updatedDriver._id,
      name: updatedDriver.name,
      email: updatedDriver.email,
      phone: updatedDriver.phone,
      role: 'driver',
      token: generateToken(updatedDriver._id, 'driver'),
    });
  } else {
    res.status(404);
    throw new Error('Driver not found');
  }
});

// @desc    Toggle driver availability
// @route   PATCH /api/drivers/availability
// @access  Private
export const toggleAvailability = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.driver._id);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  driver.isAvailable = !driver.isAvailable;
  await driver.save();

  res.json({ available: driver.isAvailable });
});

// @desc    Get all drivers (Admin)
// @route   GET /api/admin/drivers
// @access  Admin
export const getAllDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({});
  res.json(drivers);
});

// @desc    Approve driver (Admin)
// @route   PATCH /api/admin/drivers/:id/approve
// @access  Admin
export const approveDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  driver.isApproved = true;
  await driver.save();
  res.json({ message: 'Driver approved' });
});
