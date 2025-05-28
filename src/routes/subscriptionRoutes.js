import express from 'express';
const router = express.Router();
import  {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptionHistory
}from '../controllers/subscriptionController.js';
import { protect }from '../middleware/auth.js';
import  {
  validateCreateSubscription,
  validateUpdateSubscription,
  validateMongoId
} from '../middleware/validation.js';

router.use(protect); 

router.post('/', validateCreateSubscription, createSubscription);
router.get('/:userId', validateMongoId('userId'), getSubscription);
router.put('/:userId', validateUpdateSubscription, updateSubscription);
router.delete('/:userId', validateMongoId('userId'), cancelSubscription);
router.get('/:userId/history', validateMongoId('userId'), getSubscriptionHistory);

export default router;