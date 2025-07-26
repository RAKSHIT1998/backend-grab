import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number, text: String, createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Review', reviewSchema);