import Partner from '../models/partnerModel.js';
import Menu from '../models/menuModel.js';
import MartProduct from '../models/martModel.js';
import Order from '../models/Order.js';
import Wallet from '../models/walletModel.js';
import Payout from '../models/payoutModel.js';
import generateToken from '../utils/generateToken.js';

export const registerPartner = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      partnerType,
      fssaiLicense,
      bankDetails,
    } = req.body;

    const exists = await Partner.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Partner already exists' });

    const partner = await Partner.create({
      name,
      phone,
      email,
      password,
      partnerType,
      fssaiLicense,
      bankDetails,
    });

    res.status(201).json({ token: generateToken(partner._id), partner });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const loginPartner = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const partner = await Partner.findOne({ phone });
    if (!partner || partner.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(partner._id), partner });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getProfile = (req, res) => {
  res.json(req.partner);
};

export const updateProfile = async (req, res) => {
  const partner = req.partner;
  partner.name = req.body.name || partner.name;
  partner.address = req.body.address || partner.address;
  await partner.save();
  res.json(partner);
};

export const toggleAvailability = async (req, res) => {
  const partner = req.partner;
  partner.isActive = !partner.isActive;
  await partner.save();
  res.json({ isActive: partner.isActive });
};

export const getMenu = async (req, res) => {
  if (req.partner.partnerType === 'restaurant') {
    const items = await Menu.find();
    return res.json(items);
  }
  const items = await MartProduct.find();
  res.json(items);
};

export const addMenuItem = async (req, res) => {
  let item;
  if (req.partner.partnerType === 'restaurant') {
    item = await Menu.create({ ...req.body });
  } else {
    item = await MartProduct.create({ ...req.body });
  }
  res.status(201).json(item);
};

export const editMenuItem = async (req, res) => {
  const { itemId } = req.params;
  let item;
  if (req.partner.partnerType === 'restaurant') {
    item = await Menu.findByIdAndUpdate(itemId, req.body, { new: true });
  } else {
    item = await MartProduct.findByIdAndUpdate(itemId, req.body, { new: true });
  }
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

export const deleteMenuItem = async (req, res) => {
  const { itemId } = req.params;
  let item;
  if (req.partner.partnerType === 'restaurant') {
    item = await Menu.findByIdAndDelete(itemId);
  } else {
    item = await MartProduct.findByIdAndDelete(itemId);
  }
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Deleted' });
};

export const getActiveOrders = async (req, res) => {
  const orders = await Order.find({ partner: req.partner._id, status: { $ne: 'delivered' } });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.partner.toString() !== req.partner._id.toString()) {
    return res.status(403).json({ message: 'Not your order' });
  }
  order.status = status;
  await order.save();
  res.json(order);
};

export const getOrderHistory = async (req, res) => {
  const orders = await Order.find({ partner: req.partner._id, status: 'delivered' });
  res.json(orders);
};

export const getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.partner._id });
  res.json(wallet || { balance: 0 });
};

export const requestPayout = async (req, res) => {
  const { amount, method } = req.body;
  const payout = await Payout.create({
    amount,
    to: req.partner._id,
    toRole: 'Partner',
    method,
  });
  res.status(201).json(payout);
};

