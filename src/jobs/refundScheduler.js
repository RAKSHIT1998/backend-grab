import cron from 'node-cron';
import { processPendingRefunds } from '../services/refundService.js';

export function startRefundScheduler() {
  // Runs at minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const count = await processPendingRefunds();
      if (count > 0) {
        console.log(`Processed ${count} refund request(s)`);
      }
    } catch (err) {
      console.error('Error running refund scheduler', err);
    }
  });
}
