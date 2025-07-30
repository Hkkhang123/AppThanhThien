import pool from './config/db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './route/authRoute.js';
import routeRoute from './route/routeRoute.js';
import tripRoute from './route/tripRoute.js';
import ticketRoute from './route/ticketRoute.js';
import userRoute from './route/userRoute.js';
import goodsRoute from './route/goodsRoute.js';
import dashboardRoute from './route/dashboardRoute.js';
import feedbackRoute from './route/feedbackRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

try {
  const res = await pool.query('SELECT NOW()');
  console.log('Kết nối database thành công:', res.rows[0]);
} catch (err) {
  console.error('Lỗi kết nối database:', err);
}

app.use('/api/auth', authRoute);
app.use('/api/routes', routeRoute);
app.use('/api/trips', tripRoute);
app.use('/api/tickets', ticketRoute);
app.use('/api/users', userRoute);
app.use('/api/goods', goodsRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/feedback', feedbackRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});