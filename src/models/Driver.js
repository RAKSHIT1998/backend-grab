import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'auto'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  }
});

driverSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('Driver', driverSchema);
