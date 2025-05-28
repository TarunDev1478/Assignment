import asyncHandler from ('../utils/asyncHandler');
import subscriptionService from ('../services/subscriptionService');

const createSubscription = asyncHandler(async (req, res, next) => {
  const { planId } = req.body;
  const userId = req.user.id;

  const subscription = await subscriptionService.createSubscription(userId, planId);

  res.status(201).json({
    success: true,
    data: subscription
  });
});

const getSubscription = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this subscription'
    });
  }

  const subscription = await subscriptionService.getUserSubscription(userId);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      error: 'No subscription found'
    });
  }

  res.status(200).json({
    success: true,
    data: subscription
  });
});

const updateSubscription = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { planId } = req.body;

  if (req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this subscription'
    });
  }

  const subscription = await subscriptionService.updateSubscription(userId, planId);

  res.status(200).json({
    success: true,
    data: subscription
  });
});

const cancelSubscription = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { reason } = req.body;
  
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this subscription'
      });
    }
  
    const subscription = await subscriptionService.cancelSubscription(userId, reason);
  
    res.status(200).json({
      success: true,
      data: subscription
    });
  });
  
  const getSubscriptionHistory = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
  
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this subscription history'
      });
    }
  
    const subscriptions = await subscriptionService.getAllUserSubscriptions(userId);
  
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  });
  
  export default  {
    createSubscription,
    getSubscription,
    updateSubscription,
    cancelSubscription,
    getSubscriptionHistory
  };