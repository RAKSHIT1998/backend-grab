// src/models/walletModel.js
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role',
      required: true,
    },
    role: {
      type: String,
      enum: ['User', 'Driver', 'Partner', 'MartPartner'],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['credit', 'debit'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
        },
        refId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'refModel',
        },
        refModel: {
          type: String,
          enum: ['Order', 'Payout', 'Refund'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
