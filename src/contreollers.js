const User = require('../models/User');
const Driver = require('../models/Driver');
const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Ride = require('../models/Ride');
const Mart = require('../models/Mart');
const Porter = require('../models/Porter');
const Rating = require('../models/Rating');
const Review = require('../models/Review');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// ======================
// AUTH CONTROLLERS
// ======================

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    address: req.body.address
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

// ======================
// USER CONTROLLERS
// ======================

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

// ======================
// DRIVER CONTROLLERS
// ======================

exports.registerDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.create({
    user: req.user.id,
    vehicleType: req.body.vehicleType,
    vehicleNumber: req.body.vehicleNumber,
    licenseNumber: req.body.licenseNumber,
    currentLocation: req.body.currentLocation
  });

  // Update user role to driver
  await User.findByIdAndUpdate(req.user.id, { role: 'driver' });

  res.status(201).json({
    status: 'success',
    data: { driver }
  });
});

exports.getNearbyDrivers = catchAsync(async (req, res, next) => {
  const { longitude, latitude, maxDistance = 5000 } = req.query;
  
  const drivers = await Driver.find({
    isAvailable: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: drivers.length,
    data: { drivers }
  });
});

// ======================
// RIDE CONTROLLERS
// ======================

exports.requestRide = catchAsync(async (req, res, next) => {
  const { pickupLocation, dropoffLocation, rideType } = req.body;
  
  const driver = await Driver.findOne({
    isAvailable: true,
    vehicleType: rideType === 'bike' ? 'bike' : 'car',
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickupLocation.coordinates
        },
        $maxDistance: 5000
      }
    }
  });

  if (!driver) {
    return next(new AppError('No drivers available in your area', 404));
  }

  const ride = await Ride.create({
    user: req.user.id,
    driver: driver._id,
    pickupLocation,
    dropoffLocation,
    rideType,
    status: 'requested'
  });

  // Update driver availability
  driver.isAvailable = false;
  await driver.save();

  res.status(201).json({
    status: 'success',
    data: { ride }
  });
});

// ======================
// RESTAURANT CONTROLLERS
// ======================

exports.getNearbyRestaurants = catchAsync(async (req, res, next) => {
  const { longitude, latitude, maxDistance = 5000, cuisine } = req.query;
  
  const filter = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  };

  if (cuisine) filter.cuisine = { $in: cuisine.split(',') };

  const restaurants = await Restaurant.find(filter);

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: { restaurants }
  });
});

// ======================
// ORDER CONTROLLERS
// ======================

exports.createOrder = catchAsync(async (req, res, next) => {
  const { restaurant, items, deliveryAddress, paymentMethod } = req.body;
  
  // Calculate total price
  const menuItems = await Menu.find({ 
    _id: { $in: items.map(item => item.itemId) },
    restaurant
  });

  const totalPrice = items.reduce((total, item) => {
    const menuItem = menuItems.find(mi => mi._id.equals(item.itemId));
    return total + (menuItem.price * item.quantity);
  }, 0);

  const order = await Order.create({
    user: req.user.id,
    restaurant,
    items,
    deliveryAddress,
    totalPrice,
    paymentMethod,
    status: 'pending'
  });

  // Clear user's cart
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

// ======================
// MART (GROCERY) CONTROLLERS
// ======================

exports.createMartOrder = catchAsync(async (req, res, next) => {
  const { items, deliveryAddress, paymentMethod } = req.body;
  
  // Calculate total price (would fetch actual prices from Mart items in production)
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const order = await Mart.create({
    user: req.user.id,
    items,
    deliveryAddress,
    totalPrice,
    paymentMethod,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

// ======================
// PORTER CONTROLLERS
// ======================

exports.requestPorter = catchAsync(async (req, res, next) => {
  const { pickupLocation, dropoffLocation, items, vehicleType } = req.body;
  
  const porter = await Driver.findOne({
    isAvailable: true,
    vehicleType,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickupLocation.coordinates
        },
        $maxDistance: 5000
      }
    }
  });

  if (!porter) {
    return next(new AppError('No porters available in your area', 404));
  }

  const porterRequest = await Porter.create({
    user: req.user.id,
    driver: porter._id,
    pickupLocation,
    dropoffLocation,
    items,
    status: 'requested'
  });

  // Update driver availability
  porter.isAvailable = false;
  await porter.save();

  res.status(201).json({
    status: 'success',
    data: { porterRequest }
  });
});

// ======================
// RATING & REVIEW CONTROLLERS
// ======================

exports.createRating = catchAsync(async (req, res, next) => {
  const { rating, review, serviceType, serviceId } = req.body;
  
  const newRating = await Rating.create({
    user: req.user.id,
    serviceType,
    serviceId,
    rating,
    review
  });

  // Update average rating for the service
  await updateServiceRating(serviceType, serviceId);

  res.status(201).json({
    status: 'success',
    data: { rating: newRating }
  });
});

// ======================
// UTILITY FUNCTIONS
// ======================

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const updateServiceRating = async (serviceType, serviceId) => {
  const ratings = await Rating.aggregate([
    { $match: { serviceType, serviceId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);

  const avgRating = ratings.length > 0 ? ratings[0].avgRating : 0;

  switch (serviceType) {
    case 'restaurant':
      await Restaurant.findByIdAndUpdate(serviceId, { rating: avgRating });
      break;
    case 'driver':
      await Driver.findByIdAndUpdate(serviceId, { rating: avgRating });
      break;
    // Add other service types as needed
  }
};
