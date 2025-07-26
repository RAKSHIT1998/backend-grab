import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    image: String,
    link: String,
    publishedAt: Date,
    trending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);
export default News;
