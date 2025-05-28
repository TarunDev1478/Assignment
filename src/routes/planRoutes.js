import express from 'express';
const router = express.Router();
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan
} from '../controllers/planController.js';
import  { protect } from '../middleware/auth.js';
import {
  validateCreatePlan,
  validateMongoId
} from '../middleware/validation.js';

// Public routes
router.get('/', getPlans);
router.get('/:id', validateMongoId('id'), getPlan);

// Protected routes
router.use(protect);
router.post('/', validateCreatePlan, createPlan);
router.put('/:id', validateMongoId('id'), updatePlan);
router.delete('/:id', validateMongoId('id'), deletePlan);

export default router;