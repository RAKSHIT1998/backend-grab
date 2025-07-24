// src/models/contentModel.js
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'about',
        'terms',
        'privacy',
        'help',
        'faq',
        'bannerText',
        'footerNote',
        'homePromo',
        'supportContact',
      ],
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
