import BikeTaxi from '../models/bikeTaxiModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Register new bike taxi
// @route   POST /api/bike
export const registerBikeTaxi = asyncHandler(async (req, res) => {
  const { userId, vehicleNumber, licenseImage, rcImage } = req.body;

  const newBike = new BikeTaxi({
    userId,
    vehicleNumber,
    licenseImage,
    rcImage,
    status: 'pending',
    isAvailable: false
  });

  const saved = await newBike.save();
  res.status(201).json(saved);
});

// @desc    Get all available bike taxis
// @route   GET /api/bike/available
export const getAvailableBikeTaxis = asyncHandler(async (req, res) => {
  const bikes = await BikeTaxi.find({ isAvailable: true, status: 'approved' });
  res.json(bikes);
});

// @desc    Approve or reject bike taxi
// @route   PUT /api/admin/bike/:id/status
export const updateBikeTaxiStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const bike = await BikeTaxi.findById(req.params.id);

  if (!bike) {
    res.status(404);
    throw new Error('Bike taxi not found');
  }

  bike.status = status;
  await bike.save();
  res.json({ message: `Bike taxi ${status}` });
});

// @desc    Toggle availability
// @route   PUT /api/bike/:id/availability
export const toggleBikeAvailability = asyncHandler(async (req, res) => {
  const bike = await BikeTaxi.findById(req.params.id);
  if (!bike) {
    res.status(404);
    throw new Error('Bike taxi not found');
  }

  bike.isAvailable = !bike.isAvailable;
  await bike.save();
  res.json({ message: `Availability toggled to ${bike.isAvailable}` });
});
