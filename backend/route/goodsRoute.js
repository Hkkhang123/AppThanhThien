import express from 'express';
import {
  createGoodsHandler,
  getUserGoodsHandler,
  getGoodsByIdHandler,
  getGoodsByPhoneHandler,
  deleteGoodsHandler,
  getAllGoodsAdminHandler,
  cancelGoodsHandler,
  updateGoodsDeliveryStatusHandler,
  quickQuoteHandler
} from '../controller/goodsController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Đặt đơn hàng gửi giao (có thể cho phép khách vãng lai)
router.post('/', createGoodsHandler);
// Lấy đơn hàng của user (cần đăng nhập)
router.get('/my', authenticateToken, getUserGoodsHandler);
// Lấy đơn hàng theo id
router.get('/:id', getGoodsByIdHandler);
// Tra cứu đơn hàng theo SĐT
router.get('/', getGoodsByPhoneHandler);
// Lấy danh sách đơn hàng gửi giao cho admin (cần đăng nhập và là admin)
router.get('/all', authenticateToken, requireAdmin, getAllGoodsAdminHandler);
// Hủy đơn hàng (cần đăng nhập)
router.delete('/:id', authenticateToken, cancelGoodsHandler);
router.patch('/:id/delivery-status', authenticateToken, requireAdmin, updateGoodsDeliveryStatusHandler);
router.post('/quick-quote', quickQuoteHandler);

export default router; 