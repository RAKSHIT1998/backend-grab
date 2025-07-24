// src/controllers/restaurantController.js
import Restaurant from '../models/restaurantModel.js';
import Order from '../models/orderModel.js';

// Get all orders for a restaurant
export const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurant orders', error });
  }
};

// Update order status by restaurant
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.restaurant.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};

// src/controllers/martController.js
import Mart from '../models/martModel.js';
import Order from '../models/orderModel.js';

// Get all orders for a mart store
export const getMartOrders = async (req, res) => {
  try {
    const orders = await Order.find({ mart: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mart orders', error });
  }
};

// Update order status by mart store
export const updateMartOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.mart.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Mart order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update mart order status', error });
  }
};
