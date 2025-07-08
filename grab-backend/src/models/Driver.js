const mongoose = require('mongoose');
const driverSchema = new mongoose.Schema({
  name: String, phone: String, email: String, password: String,
  vehicleType: { type: String, enum: ["bike", "car", "porter"] },
  vehicleNo: String, verified: { type: Boolean, default: false },
  kyc: String, location: { lat: Number, lng: Number }, status: { type: String, default: "offline" },
  rating: { type: Number, default: 0 }, createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Driver", driverSchema);