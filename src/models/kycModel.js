import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerModel',
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ['Driver', 'Partner'],
    },
    documentType: String,
    documentNumber: String,
    images: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const KYC = mongoose.model('KYC', kycSchema);
export default KYC;
