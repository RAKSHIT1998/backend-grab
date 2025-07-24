import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'toRole',
      required: true,
    },
    toRole: {
      type: String,
      enum: ['Driver', 'Partner', 'MartPartner'],
      required: true,
    },
    method: {
      type: String, // bank, UPI, etc.
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    notes: String,
    payoutResponse: Object, // Razorpay or bank response
    processedAt: Date,
  },
  { timestamps: true }
);

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;
