import cron from 'node-cron';
import subscriptionService from './subscriptionService.js';

class CronService {
  initializeCronJobs() {
    cron.schedule('0 0 * * *', async () => {
      console.log('Running subscription expiry check...');
      try {
        const result = await subscriptionService.checkAndExpireSubscriptions();
        console.log(`Updated ${result.modifiedCount} expired subscriptions`);
      } catch (error) {
        console.error('Error in subscription expiry cron job:', error);
      }
    });

    console.log('Cron jobs initialized');
  }
}

const cronService =new CronService();
export default cronService;