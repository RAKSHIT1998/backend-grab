// models/driverModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: 'driver' },
    vehicleType: { type: String },
    vehicleNumber: { type: String },
    licenseNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

// Password match check
driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before save
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
