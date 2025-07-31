import Driver from '../models/driverModel.js';
import Order from '../models/Order.js';
import Wallet from '../models/walletModel.js';
import Payout from '../models/payoutModel.js';
import generateToken from '../utils/generateToken.js';

export const registerBiker = async (req, res) => {
  try {
    const { email, password, name, phone, vehicleNumber, licenseNumber } = req.body;
    const exists = await Driver.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Biker already exists' });
    const biker = await Driver.create({
      email,
      password,
      name,
      phone,
      vehicleNumber,
      licenseNumber,
      vehicleType: 'bike',
    });
    res.status(201).json({ token: generateToken(biker._id), biker });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const loginBiker = async (req, res) => {
  try {
    const { email, password } = req.body;
    const biker = await Driver.findOne({ email, vehicleType: 'bike' });
    if (!biker || !(await biker.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: generateToken(biker._id), biker });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getProfile = (req, res) => {
  res.json(req.driver);
};

export const updateProfile = async (req, res) => {
  const driver = req.driver;
  driver.name = req.body.name || driver.name;
  driver.phone = req.body.phone || driver.phone;
  if (req.body.password) driver.password = req.body.password;
  driver.vehicleNumber = req.body.vehicleNumber || driver.vehicleNumber;
  driver.licenseNumber = req.body.licenseNumber || driver.licenseNumber;
  await driver.save();
  res.json(driver);
};

export const toggleAvailability = async (req, res) => {
  const driver = req.driver;
  driver.isActive = !driver.isActive;
  await driver.save();
  res.json({ isActive: driver.isActive });
};

export const getAssignedOrders = async (req, res) => {
  const orders = await Order.find({ riderId: req.driver._id, status: { $ne: 'delivered' } });
  res.json(orders);
};

export const acceptOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.riderId && order.riderId.toString() !== req.driver._id.toString()) {
    return res.status(400).json({ message: 'Already assigned' });
  }
  order.riderId = req.driver._id;
  order.status = 'accepted';
  await order.save();
  res.json(order);
};

export const rejectOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'rejected';
  await order.save();
  res.json(order);
};

export const getOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.riderId && order.riderId.toString() !== req.driver._id.toString()) {
    return res.status(403).json({ message: 'Not your order' });
  }
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.riderId?.toString() !== req.driver._id.toString()) {
    return res.status(403).json({ message: 'Not your order' });
  }
  order.status = status;
  await order.save();
  res.json(order);
};

export const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.riderId?.toString() !== req.driver._id.toString()) {
    return res.status(403).json({ message: 'Not your order' });
  }
  order.status = 'delivered';
  await order.save();
  res.json(order);
};

export const getCompletedOrders = async (req, res) => {
  const orders = await Order.find({ riderId: req.driver._id, status: 'delivered' });
  res.json(orders);
};

export const getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.driver._id });
  res.json(wallet || { balance: 0 });
};

export const requestPayout = async (req, res) => {
  const { amount, method } = req.body;
  const payout = await Payout.create({
    amount,
    to: req.driver._id,
    toRole: 'Driver',
    method,
  });
  res.status(201).json(payout);
};

