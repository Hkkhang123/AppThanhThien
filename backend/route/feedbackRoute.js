import express from 'express';
import { createFeedbackHandler, getAllFeedbacksHandler, getFeedbackByIdHandler, updateFeedbackStatusHandler, deleteFeedbackHandler } from '../controller/feedbackController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Gửi phản hồi (khách vãng lai hoặc user đều gửi được)
router.post('/', createFeedbackHandler);
// Lấy tất cả phản hồi (admin)
router.get('/', authenticateToken, requireAdmin, getAllFeedbacksHandler);
// Lấy phản hồi theo id (admin)
router.get('/:id', authenticateToken, requireAdmin, getFeedbackByIdHandler);
// Cập nhật trạng thái phản hồi (admin)
router.patch('/:id/status', authenticateToken, requireAdmin, updateFeedbackStatusHandler);
// Xóa phản hồi (admin)
router.delete('/:id', authenticateToken, requireAdmin, deleteFeedbackHandler);

export default router; 