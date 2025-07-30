import pool from "../config/db.js";

// Lấy thông tin xe theo id
export async function getVehicleById(vehicle_id) {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
  return result.rows[0];
}

// Lấy danh sách tiện ích của xe
export async function getAmenitiesByVehicleId(vehicle_id) {
  const result = await pool.query(
    `SELECT a.id, a.name, a.icon_url
     FROM vehicle_amenities va
     JOIN amenities a ON va.amenity_id = a.id
     WHERE va.vehicle_id = $1`,
    [vehicle_id]
  );
  return result.rows;
}

export async function getVehicleImages(vehicle_id) {
  const result = await pool.query(
    'SELECT * FROM vehicle_images WHERE vehicle_id = $1',
    [vehicle_id]
  );
  return result.rows;
} 