const mongoose = require('mongoose');
const martItemSchema = new mongoose.Schema({
  name: String, price: Number, stock: Number, image: String, description: String, category: String
});
const martSchema = new mongoose.Schema({
  name: String, owner: String, phone: String, email: String, address: String,
  items: [martItemSchema], discounts: [String], ads: [String], rating: Number, createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Mart", martSchema);
