import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      validate: [validator.isMobilePhone, 'Invalid phone number'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'driver', 'partner', 'biker', 'porter', 'taxi'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
