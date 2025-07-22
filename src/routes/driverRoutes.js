const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Driver = require("../models/driverModel");
const { roles } = require("../utils/constant");

const JWT_SECRET = "#479@/^5149*@123";

// Register a new driver (bike/taxi)
router.post("/register", async (req, res) => {
  const { name, phone, email, password, type, vehicleNumber } = req.body;

  if (!["bike", "taxi"].includes(type)) {
    return res.status(400).json({ message: "Invalid driver type" });
  }

  try {
    const existing = await Driver.findOne({ email });
    if (existing) return res.status(400).json({ message: "Driver already exists" });

    const hash = await bcrypt.hash(password, 8);
    const newDriver = new Driver({
      name,
      email,
      phone,
      password: hash,
      type,
      vehicleNumber,
      approved: false,
      active: false,
      role: roles.driver
    });

    await newDriver.save();
    res.status(201).json({ message: "Driver registration submitted. Awaiting approval." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (!driver.approved)
      return res.status(403).json({ message: "Not approved by admin yet" });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: driver._id, email: driver.email, role: driver.role },
      JWT_SECRET
    );

    res.status(200).json({
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        type: driver.type,
        vehicleNumber: driver.vehicleNumber,
        active: driver.active
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all drivers (admin)
router.get("/all", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve driver (admin)
router.patch("/approve/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.approved = true;
    await driver.save();
    res.status(200).json({ message: "Driver approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle activity (online/offline)
router.patch("/toggle-activity/:id", auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.active = !driver.active;
    await driver.save();
    res.status(200).json({
      message: `Driver is now ${driver.active ? "active" : "inactive"}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get driver profile
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete driver (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
