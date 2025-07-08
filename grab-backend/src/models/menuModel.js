
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const menuSchema = new Schema({
  itemName: { type: String, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
});

const menuModel = model("menus", menuSchema);

module.exports = menuModel;
