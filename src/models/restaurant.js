import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Restaurant must have a name"],
    trim: true
  },
  cuisine: {
    type: [String],
    required: [true, "Specify at least one cuisine type"],
    enum: ["Indian", "Chinese", "Italian", "Mexican", "Continental"]
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
    default: 4.0
  },
  deliveryTime: {
    type: Number,
    required: [true, "Specify average delivery time"]
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150"
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    },
    coordinates: [Number]
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
