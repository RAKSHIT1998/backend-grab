import mongoose from 'mongoose';

const medicineOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [String],
    pickupLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },
    dropLocation: {
      address: String,
      lat: Number,
      lng: Number,
    },
    phoneNumber: String,
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

const MedicineOrder = mongoose.model('MedicineOrder', medicineOrderSchema);
export default MedicineOrder;
