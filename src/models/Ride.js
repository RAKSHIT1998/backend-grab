import mongoose from 'mongoose';
const bidSchema = new mongoose.Schema({ driverId: String, amount: Number, status: String });
const rideSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  source: Object, destination: Object, type: String, // taxi, bike, porter
  bids: [bidSchema], assignedDriver: String, fare: Number,
  status: { type: String, default: "pending" }, createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Ride', rideSchema);