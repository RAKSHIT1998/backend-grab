// src/routes/adminTaxiRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTaxiBookings,
  deleteTaxiBooking,
  assignDriverToBooking,
  updateTaxiBookingStatus,
} = require("../controllers/adminTaxiController");
const adminAuth = require("../middleware/adminAuth");

// Get all taxi bookings
router.get("/bookings", adminAuth, getAllTaxiBookings);

// Delete a specific booking
router.delete("/bookings/:id", adminAuth, deleteTaxiBooking);

// Assign driver to a booking manually
router.post("/bookings/assign-driver", adminAuth, assignDriverToBooking);

// Update booking status (e.g., "completed", "cancelled")
router.patch("/bookings/status", adminAuth, updateTaxiBookingStatus);

module.exports = router;
