// src/controllers/fareController.js
import asyncHandler from 'express-async-handler';

// Example rate config — in production, store in DB or .env
const RATE_CARD = {
  bike: { base: 10, perMinute: 6, perKm: 5 },
  taxi: { base: 30, perMinute: 8, perKm: 10 },
  porter: { base: 20, perMinute: 7, perKm: 7 },
  mart: { base: 15, perMinute: 5, perKm: 6 },
  food: { base: 12, perMinute: 4, perKm: 4 }
};

// @desc    Calculate fare for a ride/order
// @route   POST /api/fare/calculate
// @access  Public
const calculateFare = asyncHandler(async (req, res) => {
  const { type, distanceKm, etaMinutes } = req.body;

  if (!type || !distanceKm || !etaMinutes) {
    res.status(400);
    throw new Error('Missing required fields: type, distanceKm, etaMinutes');
  }

  const rates = RATE_CARD[type];
  if (!rates) {
    res.status(400);
    throw new Error('Invalid service type');
  }

  const fare =
    rates.base + (rates.perMinute * etaMinutes) + (rates.perKm * distanceKm);

  res.json({
    type,
    distanceKm,
    etaMinutes,
    fare: parseFloat(fare.toFixed(2)),
    breakdown: {
      base: rates.base,
      timeCharge: rates.perMinute * etaMinutes,
      distanceCharge: rates.perKm * distanceKm
    }
  });
});

export { calculateFare };
