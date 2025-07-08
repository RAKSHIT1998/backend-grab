const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store as hash
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  kyc: { type: String, default: "" }, // KYC doc path or number
  userType: { 
    type: String, 
    enum: ['customer', 'driver', 'vendor', 'admin'], 
    default: 'customer' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);