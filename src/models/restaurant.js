const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A restaurant must have a name']
  },
  cuisine: {
    type: [String],
    required: [true, 'Please specify cuisine type']
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  openingHours: {
    open: Number,
    close: Number
  },
  imageCover: String,
  images: [String],
  rating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  deliveryFee: Number,
  minOrder: Number,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
