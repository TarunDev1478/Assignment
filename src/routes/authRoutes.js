import express from ('express');
const router = express.Router();
import  {
  register,
  login,
  getMe
} from ('../controllers/authController');
import { protect } from ('../middleware/auth');
import  {
  validateRegistration,
  validateLogin
} from ('../middleware/validation');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

export default router;