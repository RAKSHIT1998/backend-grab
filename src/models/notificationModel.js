// src/models/notificationModel.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['User', 'Driver', 'Partner'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['order', 'system', 'promotion', 'wallet', 'custom'],
      default: 'custom',
    },
    read: {
      type: Boolean,
      default: false,
    },
    sentVia: {
      type: [String],
      enum: ['push', 'sms', 'email'],
      default: ['push'],
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
