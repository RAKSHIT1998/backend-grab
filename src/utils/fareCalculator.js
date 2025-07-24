// src/utils/fareCalculator.js

const fareRates = {
  bike: {
    base: 10, // ₹
    perMinute: 6, // ₹ per ETA minute
    perKm: 5, // optional if you want to calculate based on distance
  },
  taxi: {
    base: 25,
    perMinute: 8,
    perKm: 12,
  },
  porter: {
    base: 20,
    perMinute: 7,
    perKm: 10,
  },
  mart: {
    base: 15,
    perMinute: 5,
    perKm: 6,
  },
};

// Estimate fare based on service, ETA (minutes), distance (km)
export const calculateFare = ({ serviceType, etaMinutes, distanceKm }) => {
  const rates = fareRates[serviceType];

  if (!rates) {
    throw new Error(`Unsupported service type: ${serviceType}`);
  }

  const timeCharge = etaMinutes * rates.perMinute;
  const distanceCharge = distanceKm * rates.perKm;
  const totalFare = rates.base + timeCharge + distanceCharge;

  return {
    base: rates.base,
    timeCharge,
    distanceCharge,
    total: Math.round(totalFare),
  };
};
