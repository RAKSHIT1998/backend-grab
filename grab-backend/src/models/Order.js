const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }, // or Mart
  items: [Object], total: Number, type: String, // "food", "mart"
  status: { type: String, default: "pending" }, // "pending", "accepted", "preparing", "on the way", "delivered"
  address: String,
  location: { lat: Number, lng: Number },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  paymentStatus: { type: String, default: "pending" },
  deliveryFee: Number, surge: Number, commission: Number, gst: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);