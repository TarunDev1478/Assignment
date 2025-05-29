import express from 'express';
const router = express.Router();
import  {
  register,
  login,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import  {
  validateRegistration,
  validateLogin
} from '../middleware/validation.js';

router.post('/register', validateRegistration,register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

export default router;