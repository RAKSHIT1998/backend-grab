// src/routes/porterRoutes.js
const express = require("express");
const Porter = require("../models/porterModel");
const auth = require("../middleware/auth.cjs");
const { v4: uuidv4 } = require("uuid");

const porterRouter = express.Router();

// Create new porter order
porterRouter.post("/", auth, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      goodsType,
      weight,
      dimensions,
      contactNumber,
      instructions,
    } = req.body;

    const newOrder = await Porter.create({
      orderId: uuidv4(),
      user: req.user.id,
      pickupLocation,
      dropLocation,
      goodsType,
      weight,
      dimensions,
      contactNumber,
      instructions,
      status: "Pending",
    });

    res.status(201).json({ message: "Porter order created", order: newOrder });
  } catch (err) {
    console.error("Porter order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all porter orders (admin)
porterRouter.get("/all", async (req, res) => {
  try {
    const orders = await Porter.find().populate("user");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get user-specific orders
porterRouter.get("/my-orders", auth, async (req, res) => {
  try {
    const myOrders = await Porter.find({ user: req.user.id });
    res.json(myOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
});

// Update porter order status
porterRouter.patch("/status/:id", auth, async (req, res) => {
  try {
    const updated = await Porter.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Status updated", order: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete porter order
porterRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Porter.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = porterRouter;
