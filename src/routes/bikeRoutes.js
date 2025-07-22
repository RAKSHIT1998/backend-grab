// src/routes/bikeRoutes.js
const express = require("express");
const Bike = require("../models/bikeModel");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

const bikeRouter = express.Router();

// Create a bike delivery request
bikeRouter.post("/", auth, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      parcelDetails,
      deliveryType,
      phoneNumber,
    } = req.body;

    const bikeOrder = await Bike.create({
      orderId: uuidv4(),
      user: req.user.id,
      pickupLocation,
      dropLocation,
      parcelDetails,
      deliveryType,
      phoneNumber,
      status: "Pending",
    });

    res.status(201).json({
      message: "Bike delivery order created successfully",
      order: bikeOrder,
    });
  } catch (err) {
    console.error("Bike order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all bike orders (admin)
bikeRouter.get("/all", async (req, res) => {
  try {
    const orders = await Bike.find().populate("user");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get current user's bike orders
bikeRouter.get("/my-orders", auth, async (req, res) => {
  try {
    const myOrders = await Bike.find({ user: req.user.id });
    res.json(myOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your bike orders" });
  }
});

// Update bike order status
bikeRouter.patch("/status/:id", auth, async (req, res) => {
  try {
    const updated = await Bike.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Status updated", order: updated });
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

// Delete a bike order
bikeRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Bike.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = bikeRouter;
