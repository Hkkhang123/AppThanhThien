import express from 'express';
import {
  createRouteHandler,
  getAllRoutesHandler,
  getRouteByIdHandler,
  updateRouteHandler,
  deleteRouteHandler
} from '../controller/routeController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createRouteHandler);
router.get('/', getAllRoutesHandler);
router.get('/:id', getRouteByIdHandler);
router.put('/:id', authenticateToken, requireAdmin, updateRouteHandler);
router.delete('/:id', authenticateToken, requireAdmin, deleteRouteHandler);

export default router; 