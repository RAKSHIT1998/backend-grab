// src/models/paymentModel.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // Razorpay Order ID or Internal Order ID
    },
    paymentId: {
      type: String,
      required: false, // Will be filled after payment
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String, // UPI, card, netbanking, wallet, etc.
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userRole',
      required: true,
    },
    userRole: {
      type: String,
      enum: ['User', 'Driver', 'Partner', 'MartPartner'],
    },
    paymentResponse: {
      type: Object, // Raw Razorpay response
    },
    notes: {
      type: String,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    receiptUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
