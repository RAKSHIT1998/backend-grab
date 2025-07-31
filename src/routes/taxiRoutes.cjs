// src/routes/taxiRoutes.js

const express = require("express");
const taxiRouter = express.Router();
const auth = require("../middleware/auth.cjs");
let getIO;
async function loadSocket() {
  if (!getIO) {
    const mod = await import("../socket/socket.js");
    getIO = mod.getIO;
  }
  return getIO();
}
let Taxi;
async function getTaxiModel() {
  if (!Taxi) {
    const mod = await import("../models/taxiModel.js");
    Taxi = mod.default;
  }
  return Taxi;
}
const { v4: uuidv4 } = require("uuid");

// Create a taxi ride request
taxiRouter.post("/", auth, async (req, res) => {
  try {
    const Taxi = await getTaxiModel();
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

    // Notify available drivers about the new taxi request
    const io = await loadSocket();
    if (io) {
      io.of("/driver").emit("taxi-request", {
        rideId: ride.rideId,
        userId: req.user.id,
        pickupLocation,
        dropLocation,
        rideType,
        phoneNumber,
      });
    }

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
    const Taxi = await getTaxiModel();
    const rides = await Taxi.find().populate("user");
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch taxi rides" });
  }
});

// Get rides for the logged-in user
taxiRouter.get("/my", auth, async (req, res) => {
  try {
    const Taxi = await getTaxiModel();
    const myRides = await Taxi.find({ user: req.user.id });
    res.status(200).json(myRides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your rides" });
  }
});

// Update ride status
taxiRouter.patch("/status/:id", auth, async (req, res) => {
  try {
    const Taxi = await getTaxiModel();
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
    const Taxi = await getTaxiModel();
    const deleted = await Taxi.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ride not found" });
    res.status(200).json({ message: "Ride deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = taxiRouter;
