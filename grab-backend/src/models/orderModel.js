
// const { Schema, model } = require('mongoose');
// const mongoose = require('mongoose');

// const orderSchema = new Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
//     items: [{
//         menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'menus', required: true },
//         quantity: { type: Number, required: true }
//     }],
//     totalAmount: { type: Number, required: true },
//     paymentStatus: { type: String, enum: ['pending','in progress' ,'completed'], default: 'pending' },
//     createdAt: { type: Date, default: Date.now }
// });

// const orderModel = model('orders', orderSchema);

// module.exports = orderModel;

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const orderItemSchema = new Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'menus', 
    required: true 
  },
  itemName: { type: String, required: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  description: { type: String, default: '' },
});

const orderSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'customers', 
    required: true 
  },
  orderItems: [orderItemSchema],
  tableNumber: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['In Progress', 'Prepared', 'Delivered'], 
    default: 'In Progress' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid'], 
    default: 'Pending' 
  },
  orderDate: { type: Date, default: Date.now },
  // User details stored at time of order (for email purposes)
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
}, {
  timestamps: true
});

const orderModel = model('orders', orderSchema);
module.exports = orderModel;
