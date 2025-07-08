const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  available: { type: Boolean, default: true },
  image: String, // URL/path
  description: String,
  veg: { type: Boolean, default: true },
  cuisine: String,
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  owner: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  address: String,
  accountNumber: String,
  ifsc: String,
  gst: String,
  fssai: String,
  fssaiPhoto: String,
  verified: { type: Boolean, default: false },
  operationOn: { type: Boolean, default: true },
  openingTime: { type: String, default: "09:00" },
  closingTime: { type: String, default: "22:00" },
  menu: [menuItemSchema],
  cuisines: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);