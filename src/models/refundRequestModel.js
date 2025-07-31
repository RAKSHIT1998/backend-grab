import mongoose from 'mongoose';

const refundRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'rejected'],
      default: 'pending',
    },
    processedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

const RefundRequest = mongoose.model('RefundRequest', refundRequestSchema);
export default RefundRequest;
