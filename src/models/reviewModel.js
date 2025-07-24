// src/models/reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['Driver', 'Restaurant', 'Partner'],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    tags: [String], // e.g. ['clean vehicle', 'on time', 'rude']
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
