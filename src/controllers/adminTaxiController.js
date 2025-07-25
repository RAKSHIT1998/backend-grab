// src/controllers/adminTaxiController.js
import taxiModel from '../models/taxiModel.js';
import userModel from '../models/userModel.js';

// Get all taxi bookings
const getAllTaxiBookings = async (req, res) => {
  try {
    const bookings = await taxiModel.find().populate("user").populate("driver");
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// Delete a specific taxi booking
const deleteTaxiBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await taxiModel.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await taxiModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete booking", error });
  }
};

// Assign driver to taxi booking manually
const assignDriverToBooking = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;

    const booking = await taxiModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const driver = await userModel.findById(driverId);
    if (!driver || driver.role !== "taxi") {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    booking.driver = driverId;
    booking.status = "accepted";
    await booking.save();

    return res.status(200).json({ message: "Driver assigned", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign driver", error });
  }
};

// Update taxi booking status
const updateTaxiBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await taxiModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    return res.status(200).json({ message: "Status updated", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status", error });
  }
};

export { getAllTaxiBookings, deleteTaxiBooking, assignDriverToBooking, updateTaxiBookingStatus };
