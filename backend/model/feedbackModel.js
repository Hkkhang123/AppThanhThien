import pool from "../config/db.js";

export async function createFeedback(user_id, name, email, phone, content, type = 'feedback', status = 'pending') {
  const result = await pool.query(
    `INSERT INTO feedbacks (user_id, name, email, phone, content, type, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
    [user_id, name, email, phone, content, type, status]
  );
  return result.rows[0];
}

export async function getAllFeedbacks() {
  const result = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
  return result.rows;
}

export async function getFeedbackById(id) {
  const result = await pool.query('SELECT * FROM feedbacks WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateFeedbackStatus(id, status) {
  const result = await pool.query('UPDATE feedbacks SET status = $2 WHERE id = $1 RETURNING *', [id, status]);
  return result.rows[0];
}

export async function deleteFeedback(id) {
  await pool.query('DELETE FROM feedbacks WHERE id = $1', [id]);
  return true;
} 