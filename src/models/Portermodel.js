// src/models/porterModel.js
import mongoose from 'mongoose';

const porterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'porter'],
      required: true,
    },
    vehicleNumber: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        stars: { type: Number, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

const Porter = mongoose.model('Porter', porterSchema);
export default Porter;
