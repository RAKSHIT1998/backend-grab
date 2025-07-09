const mongoose = require('mongoose');
const porterSchema = new mongoose.Schema({
  name: String, phone: String, vehicleNo: String,
  rating: Number, status: String, location: Object, createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Porter", porterSchema);