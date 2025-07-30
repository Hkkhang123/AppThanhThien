import pool from '../config/db.js';

export async function createGoods(user_id, name, weight, price, payment_method, delivery_status, phone) {
  const result = await pool.query(
    'INSERT INTO goods (user_id, name, weight, price, payment_method, delivery_status, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_id, name, weight, price, payment_method, delivery_status, phone]
  );
  return result.rows[0];
}

export async function getGoodsByUser(user_id) {
  const result = await pool.query('SELECT * FROM goods WHERE user_id = $1', [user_id]);
  return result.rows;
}

export async function getGoodsById(id) {
  const result = await pool.query('SELECT * FROM goods WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getGoodsByPhone(phone) {
  const result = await pool.query('SELECT * FROM goods WHERE phone = $1', [phone]);
  return result.rows;
}

export async function deleteGoods(id) {
  await pool.query('DELETE FROM goods WHERE id = $1', [id]);
  return true;
}

export async function getAllGoodsAdmin({ delivery_status, phone }) {
  let query = `SELECT * FROM goods WHERE 1=1`;
  const params = [];
  let idx = 1;
  if (delivery_status) {
    query += ` AND delivery_status = $${idx++}`;
    params.push(delivery_status);
  }
  if (phone) {
    query += ` AND phone = $${idx++}`;
    params.push(phone);
  }
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

export async function updateGoodsDeliveryStatus(id, delivery_status) {
  const result = await pool.query('UPDATE goods SET delivery_status = $2 WHERE id = $1 RETURNING *', [id, delivery_status]);
  return result.rows[0];
} 