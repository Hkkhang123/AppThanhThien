import pool from "../config/db.js";

export async function createRoute(departure, destination) {
  const result = await pool.query(
    "INSERT INTO routes (departure, destination) VALUES ($1, $2) RETURNING *",
    [departure, destination]
  );
  return result.rows[0];
}

export async function getAllRoutes() {
  const result = await pool.query("SELECT * FROM routes");
  return result.rows;
}

export async function getRouteById(id) {
  const result = await pool.query("SELECT * FROM routes WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateRoute(id, departure, destination) {
  const result = await pool.query(
    "UPDATE routes SET departure = $2, destination = $3 WHERE id = $1 RETURNING *",
    [id, departure, destination]
  );
  return result.rows[0];
}

export async function deleteRoute(id) {
  await pool.query("DELETE FROM routes WHERE id = $1", [id]);
  return true;
}

// Lấy điểm đón của chuyến xe
export async function getPickupPointsByTripId(trip_id) {
  const result = await pool.query(
    'SELECT * FROM pickup_points WHERE trip_id = $1 ORDER BY pickup_time',
    [trip_id]
  );
  return result.rows;
}

// Lấy điểm trả của chuyến xe
export async function getDropoffPointsByTripId(trip_id) {
  const result = await pool.query(
    'SELECT * FROM dropoff_points WHERE trip_id = $1 ORDER BY dropoff_time',
    [trip_id]
  );
  return result.rows;
}
