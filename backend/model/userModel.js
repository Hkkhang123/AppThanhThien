import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function createUser(
  username,
  password,
  role = "user",
  email,
  phone
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (username, password, role, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, hashedPassword, role, email, phone]
  );
  return result.rows[0];
}

// Tìm user theo username, email hoặc phone
export async function findUserByIdentity(identity) {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1 OR phone = $1",
    [identity]
  );
  return result.rows[0];
}

export async function findUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

export async function findUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateUserProfile(userId, username, email, phone) {
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, username, email, phone, role',
    [username, email, phone, userId]
  );
  return result.rows[0];
}

export async function getAllStaff() {
  const result = await pool.query("SELECT id, username, email, phone, role FROM users WHERE role = 'staff'");
  return result.rows;
}

export async function updateStaff(id, email, phone) {
  const result = await pool.query(
    'UPDATE users SET email = $2, phone = $3 WHERE id = $1 AND role = $4 RETURNING *',
    [id, email, phone, 'staff']
  );
  return result.rows[0];
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return true;
}

export async function setResetOTP(email, otp, expires) {
  await pool.query('UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE email = $3', [otp, expires, email]);
}

export async function verifyResetOTP(email, otp) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND reset_otp = $2 AND reset_otp_expires > NOW()', [email, otp]);
  return result.rows[0];
}

export async function updatePasswordByEmail(email, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 10);
  const result = await pool.query('UPDATE users SET password = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE email = $2 RETURNING *', [hashed, email]);
  return result.rows[0];
}
