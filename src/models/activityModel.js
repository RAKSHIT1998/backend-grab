import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: Date,
    location: String,
    image: String,
    link: String,
    trending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
