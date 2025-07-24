// src/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'driver', 'restaurant', 'admin', 'biker', 'porter', 'taxi'],
      default: 'user',
    },
    profileImage: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    fcmToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; // ✅ Important for ES Modules
