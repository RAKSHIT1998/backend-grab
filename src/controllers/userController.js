// src/controllers/userController.js
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// @desc    Register new user
// @route   POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
export const authUser = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Verify email with OTP
// @route   POST /api/users/verify
export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (user && user.otp === otp) {
    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.json({ message: 'Email verified' });
  } else {
    res.status(400);
    throw new Error('Invalid OTP');
  }
});

// @desc    Send OTP
// @route   POST /api/users/send-otp
export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.otp = otp;
  await user.save();
  await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);
  res.json({ message: 'OTP sent to email' });
});

// @desc    Update the logged in user's location
// @route   PUT /api/users/location
export const updateUserLocation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.location = {
    lat: req.body.lat,
    lng: req.body.lng,
    address: req.body.address || user.location?.address,
  };

  await user.save();
  res.json({ message: 'Location updated' });
});
