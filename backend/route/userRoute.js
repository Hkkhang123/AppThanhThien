import express from 'express';
import { getProfileHandler, updateProfileHandler, createStaffHandler, getAllStaffHandler, updateStaffHandler, deleteStaffHandler } from '../controller/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getProfileHandler);
router.put('/me', authenticateToken, updateProfileHandler);
router.put('/profile', authenticateToken, updateProfileHandler);
router.post('/staff', authenticateToken, requireAdmin, createStaffHandler);
router.get('/staff', authenticateToken, requireAdmin, getAllStaffHandler);
router.put('/staff/:id', authenticateToken, requireAdmin, updateStaffHandler);
router.delete('/staff/:id', authenticateToken, requireAdmin, deleteStaffHandler);

export default router; 