import express from 'express';
import {
  createTripHandler,
  getAllTripsHandler,
  getTripByIdHandler,
  updateTripHandler,
  deleteTripHandler,
  searchTripsHandler
} from '../controller/tripController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createTripHandler);
router.get('/', getAllTripsHandler);
router.get('/search', searchTripsHandler);
router.get('/:id', getTripByIdHandler);
router.put('/:id', authenticateToken, requireAdmin, updateTripHandler);
router.delete('/:id', authenticateToken, requireAdmin, deleteTripHandler);

export default router;
