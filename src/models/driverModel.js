// src/models/driverModel.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ["bike", "taxi", "porter"], required: true },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
}, { timestamps: true });

driverSchema.index({ location: "2dsphere" });

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
