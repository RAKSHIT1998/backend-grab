// ✅ driverRoutes.js

import express from "express";
import Driver from "../models/driverModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register new driver
router.post("/register", async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login driver
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const driver = await Driver.findOne({ email });
    if (!driver || driver.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all drivers (admin only)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update driver profile
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete driver
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
