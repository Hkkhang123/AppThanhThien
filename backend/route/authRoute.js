import express from 'express';
import { register, login, forgotPasswordHandler, resetPasswordHandler } from '../controller/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

// Route test phân quyền admin
router.get('/admin', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome admin!', user: req.user });
});

export default router; 