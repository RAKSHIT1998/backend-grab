// src/routes/restaurantRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let Restaurant;
async function getRestaurantModel() {
  if (!Restaurant) {
    const mod = await import("../models/restaurantModel.js");
    Restaurant = mod.default;
  }
  return Restaurant;
}
let Promotion;
async function getPromotionModel() {
  if (!Promotion) {
    const mod = await import("../models/promotionModel.js");
    Promotion = mod.default;
  }
  return Promotion;
}
const { roles } = require("../utils/constant.cjs");
const auth = require("../middleware/auth.cjs");
const { v4: uuidv4 } = require("uuid");

const restaurantRouter = express.Router();
const secret = "#479@/^5149*@123";

// Register restaurant
restaurantRouter.post("/register", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const { email, phone, password, name, location } = req.body;
    const existing = await Restaurant.findOne({ email });
    if (existing) return res.status(400).json({ message: "Restaurant already exists" });

    const hashed = await bcrypt.hash(password, 8);
    const restaurant = await Restaurant.create({
      email,
      phone,
      password: hashed,
      name,
      location,
      approved: false,
      active: true,
      role: roles.partner,
      restaurantId: uuidv4(),
    });

    res.status(201).json({ message: "Restaurant registered, pending approval", restaurantId: restaurant._id });
  } catch (err) {
    console.error("Restaurant registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
restaurantRouter.post("/login", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (!restaurant.approved) return res.status(403).json({ message: "Not approved by admin" });
    if (!restaurant.active) return res.status(403).json({ message: "Account disabled" });

    const match = await bcrypt.compare(password, restaurant.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: restaurant._id, role: restaurant.role }, secret);
    res.json({ token, restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all restaurants (admin)
restaurantRouter.get("/", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

// Approve restaurant (admin)
restaurantRouter.patch("/approve/:id", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    restaurant.approved = true;
    await restaurant.save();
    res.json({ message: "Restaurant approved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve" });
  }
});

// Toggle restaurant activity (admin)
restaurantRouter.patch("/toggle/:id", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    restaurant.active = !restaurant.active;
    await restaurant.save();
    res.json({ message: `Restaurant ${restaurant.active ? "enabled" : "disabled"}` });
  } catch (err) {
    res.status(500).json({ message: "Toggle error" });
  }
});

// Delete restaurant (admin)
restaurantRouter.delete("/:id", async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
});

// Get restaurant profile
restaurantRouter.get('/profile/:id', async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Fetch error' });
  }
});

// Update restaurant profile (bank details, license etc.)
restaurantRouter.put('/profile/:id', async (req, res) => {
  try {
    const Restaurant = await getRestaurantModel();
    const update = {
      fssaiLicense: req.body.fssaiLicense,
      bankDetails: req.body.bankDetails,
      ownerName: req.body.ownerName,
      address: req.body.address,
      image: req.body.image,
    };
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Update error' });
  }
});

// Restaurant analytics (basic)
restaurantRouter.get('/:id/analytics', async (req, res) => {
  try {
    const { default: Order } = await import("../models/orderModel.js");
    const orders = await Order.find({ restaurantId: req.params.id });
    const totalEarnings = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ totalOrders: orders.length, totalEarnings });
  } catch (err) {
    res.status(500).json({ message: 'Analytics error' });
  }
});

// Payout info for last week (Mon-Sun)
restaurantRouter.get('/:id/payouts', async (req, res) => {
  try {
    const { default: Order } = await import("../models/orderModel.js");
    const now = new Date();
    const day = now.getDay();
    const tuesday = new Date(now);
    tuesday.setDate(now.getDate() - ((day + 6) % 7)); // Last Tuesday
    const monday = new Date(tuesday);
    monday.setDate(tuesday.getDate() - 7);
    const orders = await Order.find({
      restaurantId: req.params.id,
      createdAt: { $gte: monday, $lt: tuesday },
    });
    const total = orders.reduce((s, o) => s + o.totalAmount, 0);
    res.json({ periodStart: monday, periodEnd: tuesday, total });
  } catch (err) {
    res.status(500).json({ message: 'Payout calc error' });
  }
});

// Create promotion
restaurantRouter.post('/:id/promotions', async (req, res) => {
  try {
    const Promotion = await getPromotionModel();
    const promo = await Promotion.create({
      restaurantId: req.params.id,
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      deductFromPayout: req.body.deductFromPayout,
    });
    res.status(201).json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Promotion error' });
  }
});

module.exports = restaurantRouter;
