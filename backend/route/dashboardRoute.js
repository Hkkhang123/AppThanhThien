import express from 'express';
import { getDashboardStats, exportReportExcel } from '../controller/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, getDashboardStats);
router.get('/export-report', authenticateToken, requireAdmin, exportReportExcel);

export default router; 