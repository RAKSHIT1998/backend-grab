import RefundRequest from '../models/refundRequestModel.js';
import Payment from '../models/paymentModel.js';

export async function processPendingRefunds() {
  const pending = await RefundRequest.find({ status: 'pending' });
  for (const reqRef of pending) {
    await Payment.findOneAndUpdate(
      { orderId: reqRef.orderId },
      { status: 'refunded', refundedAmount: reqRef.amount, refundReason: reqRef.reason }
    );
    reqRef.status = 'processed';
    reqRef.processedAt = new Date();
    await reqRef.save();
  }
  return pending.length;
}
