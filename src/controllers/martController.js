// src/controllers/martController.js
import asyncHandler from 'express-async-handler';
import Mart from '../models/martModel.js';
import Product from '../models/martProductModel.js';

// @desc    Get all mart partners
// @route   GET /api/mart/partners
// @access  Public
export const getMartPartners = asyncHandler(async (req, res) => {
  const partners = await Mart.find({ isApproved: true });
  res.json(partners);
});

// @desc    Register new mart partner
// @route   POST /api/mart/register
// @access  Public
export const registerMartPartner = asyncHandler(async (req, res) => {
  const { name, phone, password, storeName, location } = req.body;

  const existing = await Mart.findOne({ phone });
  if (existing) {
    res.status(400);
    throw new Error('Mart partner already exists');
  }

  const partner = await Mart.create({
    name,
    phone,
    password,
    storeName,
    location,
  });

  res.status(201).json({
    _id: partner._id,
    name: partner.name,
    phone: partner.phone,
    storeName: partner.storeName,
  });
});

// @desc    Add product to mart
// @route   POST /api/mart/products
// @access  Private (Mart Partner)
export const addMartProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, quantity } = req.body;
  const partnerId = req.user._id;

  const product = new Product({
    name,
    price,
    description,
    image,
    quantity,
    partner: partnerId,
  });

  await product.save();
  res.status(201).json(product);
});

// @desc    Get all products of a mart partner
// @route   GET /api/mart/products
// @access  Private (Mart Partner)
export const getMyMartProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ partner: req.user._id });
  res.json(products);
});

// @desc    Get products of a specific mart partner by ID
// @route   GET /api/mart/products/:partnerId
// @access  Public
export const getPartnerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ partner: req.params.partnerId });
  res.json(products);
});
