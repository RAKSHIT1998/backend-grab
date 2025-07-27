import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
  userAgent: String,
  ipAddress: String,
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
export default LoginHistory;
