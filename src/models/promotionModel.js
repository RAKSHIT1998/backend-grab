import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    title: String,
    description: String,
    budget: Number,
    isActive: { type: Boolean, default: true },
    deductFromPayout: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Promotion', promotionSchema);
