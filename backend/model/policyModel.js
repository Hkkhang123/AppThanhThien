import pool from "../config/db.js";

// Lấy chính sách của chuyến xe
export async function getPolicyByTripId(trip_id) {
  const result = await pool.query(
    'SELECT * FROM policies WHERE trip_id = $1',
    [trip_id]
  );
  return result.rows[0]; // Mỗi chuyến xe 1 chính sách
} 