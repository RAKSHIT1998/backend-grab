// src/controllers/ratingController.js
import Restaurant from '../models/restaurantModel.js';
import Product from '../models/productModel.js';
import Driver from '../models/driverModel.js';
import asyncHandler from 'express-async-handler';

// Rate a restaurant
export const rateRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { stars, comment } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  restaurant.ratings.push({
    user: req.user._id,
    stars,
    comment,
  });

  await restaurant.save();
  res.status(201).json({ message: 'Rating submitted for restaurant' });
});

// Rate a product
export const rateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { stars, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.ratings.push({
    user: req.user._id,
    stars,
    comment,
  });

  await product.save();
  res.status(201).json({ message: 'Rating submitted for product' });
});

// Rate a driver
export const rateDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;
  const { stars, comment } = req.body;

  const driver = await Driver.findById(driverId);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }

  driver.ratings.push({
    user: req.user._id,
    stars,
    comment,
  });

  await driver.save();
  res.status(201).json({ message: 'Rating submitted for driver' });
});

// Admin - Get all ratings for any entity
export const getAllRatings = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find().select('name ratings');
  const products = await Product.find().select('name ratings');
  const drivers = await Driver.find().select('name ratings');

  res.json({ restaurants, products, drivers });
});
