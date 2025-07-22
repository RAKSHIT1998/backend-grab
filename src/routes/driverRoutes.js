// src/routes/driverRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Driver = require("../models/driverModel");
const auth = require("../middleware/auth");
const { roles } = require("../utils/constant");

const driverRouter = express.Router();
const secret = "#479@/^5149*@123";

// Register Driver
driverRouter.post("/register", async (req, res) => {
  try {
    const { email, phone, password, name, type } = req.body;
    const existing = await Driver.findOne({ email });
    if (existing) return res.status(400).json({ message: "Driver already exists" });

    const hashed = await bcrypt.hash(password, 8);
    const driver = await Driver.create({
      email,
      phone,
      password: hashed,
      name,
      type, // 'bike' | 'taxi' | 'porter'
      approved: false,
      active: true,
      role: roles.driver,
      driverId: uuidv4(),
    });

    res.status(201).json({ message: "Driver registered, pending admin approval", driverId: driver._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Driver Login
driverRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!driver.approved) return res.status(403).json({ message: "Not approved by admin" });
    if (!driver.active) return res.status(403).json({ message: "Account disabled" });

    const match = await bcrypt.compare(password, driver.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: driver._id, role: driver.role }, secret);
    res.json({ token, driver });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Drivers (Admin)
driverRouter.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drivers" });
  }
});

// Approve Driver (Admin)
driverRouter.patch("/approve/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    driver.approved = true;
    await driver.save();
    res.json({ message: "Driver approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving driver" });
  }
});

// Toggle Driver Active Status (Admin)
driverRouter.patch("/toggle/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    driver.active = !driver.active;
    await driver.save();
    res.json({ message: `Driver ${driver.active ? "enabled" : "disabled"}` });
  } catch (err) {
    res.status(500).json({ message: "Error toggling driver status" });
  }
});

// Delete Driver
driverRouter.delete("/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting driver" });
  }
});

module.exports = driverRouter;
