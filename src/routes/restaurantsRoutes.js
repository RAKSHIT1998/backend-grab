const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add menu item with image
// (Removed duplicate POST /menu route to avoid conflicts)

// Get restaurant menu
router.get('/menu/:restaurantId', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
  res.json(restaurant.menu);
});

// POST /api/restaurants/menu
router.post('/menu', upload.single('image'), async (req, res) => {
  try {
    const { restaurantId, name, price, description, veg, cuisine, available } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const menuItem = {
      name,
      price,
      description,
      veg: veg === "true" || veg === true,
      cuisine,
      available: available === undefined ? true : available === "true" || available === true,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };
    restaurant.menu.push(menuItem);
    await restaurant.save();
    res.status(201).json({ message: "Menu item added", menu: restaurant.menu });
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item", details: err.message });
  }
});
module.exports = router;
