// src/models/driverModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Image URL for the driver's profile picture
    photo: {
      type: String,
      default: '',
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'taxi'],
      required: true,
    },
    // Brand of the vehicle (e.g. Honda, Toyota)
    vehicleBrand: {
      type: String,
      default: '',
    },
    // Model or name of the vehicle
    vehicleModel: {
      type: String,
      default: '',
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    // Driver license number for verification
    licenseNumber: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        stars: { type: Number, required: true },
        comment: { type: String },
        reply: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      lat: Number,
      lng: Number,
      updatedAt: { type: Date },
    },
    wallet: {
      balance: { type: Number, default: 0 },
      lastUpdated: { type: Date },
    },
    earnings: {
      total: { type: Number, default: 0 },
      today: { type: Number, default: 0 },
      lastUpdated: { type: Date },
    },
  },
  { timestamps: true }
);

// Virtual to calculate average rating

driverSchema.virtual('averageRating').get(function () {
  if (!this.ratings.length) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.stars, 0);
  return (total / this.ratings.length).toFixed(1);
});

driverSchema.set('toObject', { virtuals: true });
driverSchema.set('toJSON', { virtuals: true });

// Hash password before saving
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed
driverSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
