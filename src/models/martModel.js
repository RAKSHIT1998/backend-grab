// src/models/martModel.js
import mongoose from 'mongoose';

const martProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    description: { type: String },
    stock: { type: Number, default: 0 },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        stars: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'MartPartner' },
  },
  { timestamps: true }
);

const MartProduct = mongoose.model('MartProduct', martProductSchema);
export default MartProduct;
