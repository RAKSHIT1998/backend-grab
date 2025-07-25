// src/routes/taxiRoutes.js

const express = require("express");
const taxiRouter = express.Router();
const auth = require("../middleware/auth.cjs");
const Taxi = require("../models/taxiModel");
const { v4: uuidv4 } = require("uuid");

// Create a taxi ride request
taxiRouter.post("/", auth, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      fareEstimate,
      rideType,
      phoneNumber,
    } = req.body;

    const ride = await Taxi.create({
      rideId: uuidv4(),
      user: req.user.id,
      pickupLocation,
      dropLocation,
      fareEstimate,
      rideType,
      phoneNumber,
      status: "Pending",
    });

    res.status(201).json({
      message: "Taxi ride created successfully",
      ride,
    });
  } catch (error) {
    console.error("Taxi booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all taxi rides (admin)
taxiRouter.get("/all", async (req, res) => {
  try {
    const rides = await Taxi.find().populate("user");
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch taxi rides" });
  }
});

// Get rides for the logged-in user
taxiRouter.get("/my", auth, async (req, res) => {
  try {
    const myRides = await Taxi.find({ user: req.user.id });
    res.status(200).json(myRides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your rides" });
  }
});

// Update ride status
taxiRouter.patch("/status/:id", auth, async (req, res) => {
  try {
    const updated = await Taxi.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Ride not found" });
    res.status(200).json({ message: "Status updated", ride: updated });
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
});

// Delete a ride
taxiRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Taxi.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ride not found" });
    res.status(200).json({ message: "Ride deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = taxiRouter;
