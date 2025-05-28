import Subscription from ('../models/Subscription');
import Plan from ('../models/plan');
import  { SUBSCRIPTION_STATUS } from ('../utils/constant');


class SubscriptionService {
  async createSubscription(userId, planId) {
    const existingSubscription = await Subscription.findOne({
      userId,
      status: { $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.INACTIVE] }
    });

    if (existingSubscription) {
      throw new Error('User already has an active or inactive subscription');
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      throw new Error('Plan not found or is not active');
    }

    const endDate = this.calculateEndDate(new Date(), plan.duration, plan.durationUnit);

    const subscription = await Subscription.create({
      userId,
      planId,
      endDate,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      paymentHistory: [{
        amount: plan.price,
        transactionId: `TXN_${Date.now()}_${userId}`,
        status: 'success'
      }]
    });

    return await subscription.populate('planId');
  }

  async getUserSubscription(userId) {
    const subscription = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 });

    if (subscription) {
      await subscription.checkAndUpdateExpiry();
    }

    return subscription;
  }

  async getAllUserSubscriptions(userId) {
    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 });

    for (const subscription of subscriptions) {
      if (subscription.status === SUBSCRIPTION_STATUS.ACTIVE) {
        await subscription.checkAndUpdateExpiry();
      }
    }

    return subscriptions;
  }

  async updateSubscription(userId, newPlanId) {
    const currentSubscription = await Subscription.findOne({
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE
    });

    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan || !newPlan.isActive) {
      throw new Error('New plan not found or is not active');
    }

    const newEndDate = this.calculateEndDate(new Date(), newPlan.duration, newPlan.durationUnit);

    currentSubscription.planId = newPlanId;
    currentSubscription.endDate = newEndDate;
    currentSubscription.paymentHistory.push({
      amount: newPlan.price,
      transactionId: `TXN_${Date.now()}_${userId}`,
      status: 'success'
    });

    await currentSubscription.save();
    return await currentSubscription.populate('planId');
  }

  async cancelSubscription(userId, reason = '') {
    const subscription = await Subscription.findOne({
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    subscription.status = SUBSCRIPTION_STATUS.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;

    await subscription.save();
    return subscription;
  }

  calculateEndDate(startDate, duration, unit) {
    const date = new Date(startDate);
    
    switch (unit) {
      case 'days':
        date.setDate(date.getDate() + duration);
        break;
      case 'months':
        date.setMonth(date.getMonth() + duration);
        break;
      case 'years':
        date.setFullYear(date.getFullYear() + duration);
        break;
      default:
        throw new Error('Invalid duration unit');
    }
    
    return date;
  }

  async checkAndExpireSubscriptions() {
    const result = await Subscription.updateMany(
      {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        endDate: { $lt: new Date() }
      },
      {
        $set: { status: SUBSCRIPTION_STATUS.EXPIRED }
      }
    );
    
    return result;
  }
}

export default SubscriptionService();