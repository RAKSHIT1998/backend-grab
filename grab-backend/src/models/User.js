const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  kyc: { type: String }, // KYC doc path
  userType: { type: String, enum: ['customer', 'driver', 'vendor', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("User", userSchema);