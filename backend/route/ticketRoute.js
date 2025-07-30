import express from 'express';
import {
  bookTicketHandler,
  getUserTicketsHandler,
  getTicketByQRCodeHandler,
  getBookedSeatsHandler,
  lookupTicketHandler,
  cancelTicketHandler,
  getAllTicketsAdminHandler,
  updateTicketPaymentStatusHandler
} from '../controller/ticketController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', bookTicketHandler);
router.get('/my', authenticateToken, getUserTicketsHandler);
router.get('/search', getTicketByQRCodeHandler);
router.get('/booked-seats', getBookedSeatsHandler);
router.get('/lookup', lookupTicketHandler);
router.get('/all', authenticateToken, requireAdmin, getAllTicketsAdminHandler);
router.delete('/:id', authenticateToken, cancelTicketHandler);
router.patch('/:id/payment-status', authenticateToken, requireAdmin, updateTicketPaymentStatusHandler);

export default router; 