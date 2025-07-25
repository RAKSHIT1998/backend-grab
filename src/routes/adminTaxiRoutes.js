// src/routes/adminTaxiRoutes.js
import express from 'express';
import {
  getAllTaxiBookings,
  deleteTaxiBooking,
  assignDriverToBooking,
  updateTaxiBookingStatus,
} from '../controllers/adminTaxiController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Get all taxi bookings
router.get("/bookings", adminAuth, getAllTaxiBookings);

// Delete a specific booking
router.delete("/bookings/:id", adminAuth, deleteTaxiBooking);

// Assign driver to a booking manually
router.post("/bookings/assign-driver", adminAuth, assignDriverToBooking);

// Update booking status (e.g., "completed", "cancelled")
router.patch("/bookings/status", adminAuth, updateTaxiBookingStatus);

export default router;
