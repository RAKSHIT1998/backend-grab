
import mongoose, { Schema, model } from 'mongoose';

const menuSchema = new Schema({
  itemName: { type: String, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  image: { type: String },
  description: { type: String },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
});

const menuModel = model('menus', menuSchema);

export default menuModel;
