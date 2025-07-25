// src/models/taxiModel.js
import mongoose from 'mongoose';

const taxiSchema = new mongoose.Schema(
  {
    rideId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    rideType: {
      type: String,
      enum: ["Auto", "Sedan", "SUV", "BikeTaxi"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "bidding",
        "assigned",
        "accepted",
        "enRoute",
        "started",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },
    pickupLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },
    dropLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },
    distance: {
      type: Number, // in km
      required: true,
    },
    estimatedFare: {
      type: Number,
      required: true,
    },
    finalFare: {
      type: Number,
      default: null,
    },
    commission: {
      type: Number,
      default: 0, // Admin commission
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isPayoutDone: {
      type: Boolean,
      default: false,
    },
    ratingByUser: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingByDriver: {
      type: Number,
      min: 1,
      max: 5,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "wallet"],
      default: "cash",
    },
    scheduledTime: {
      type: Date,
      default: null,
    },
    bookedVia: {
      type: String,
      enum: ["instant", "scheduled"],
      default: "instant",
    },
    cancelledBy: {
      type: String,
      enum: ["user", "driver", "system", ""],
      default: "",
    },
    cancelReason: {
      type: String,
      default: "",
    },
    vehicleDetails: {
      number: String,
      model: String,
      color: String,
    },
    bidAmount: {
      type: Number,
      default: null, // For driver bidding feature
    },
    otp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Taxi = mongoose.model('Taxi', taxiSchema);
export default Taxi;
