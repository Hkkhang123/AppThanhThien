import pool from "../config/db.js";

export async function createTrip(
  route_id,
  departure_time,
  vehicle_type,
  price,
  total_seats,
  available_seats
) {
  const result = await pool.query(
    "INSERT INTO trips (route_id, departure_time, vehicle_type, price, total_seats, available_seats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      route_id,
      departure_time,
      vehicle_type,
      price,
      total_seats,
      available_seats,
    ]
  );
  return result.rows[0];
}

export async function getAllTrips() {
  const result = await pool.query("SELECT * FROM trips");
  return result.rows;
}

export async function getTripById(id) {
  const result = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateTrip(
  id,
  route_id,
  departure_time,
  vehicle_type,
  price,
  total_seats,
  available_seats
) {
  const result = await pool.query(
    "UPDATE trips SET route_id = $2, departure_time = $3, vehicle_type = $4, price = $5, total_seats = $6, available_seats = $7 WHERE id = $1 RETURNING *",
    [
      id,
      route_id,
      departure_time,
      vehicle_type,
      price,
      total_seats,
      available_seats,
    ]
  );
  return result.rows[0];
}

export async function deleteTrip(id) {
  await pool.query("DELETE FROM trips WHERE id = $1", [id]);
  return true;
}

export async function searchTrips(departure, destination, date) {
  // Truy vấn động theo các trường được cung cấp
  let query = `SELECT trips.*, routes.departure, routes.destination
               FROM trips
               JOIN routes ON trips.route_id = routes.id`;
  const conditions = [];
  const params = [];
  let idx = 1;
  if (departure) {
    conditions.push(`routes.departure = $${idx++}`);
    params.push(departure);
  }
  if (destination) {
    conditions.push(`routes.destination = $${idx++}`);
    params.push(destination);
  }
  if (date) {
    conditions.push(`DATE(trips.departure_time) = $${idx++}`);
    params.push(date);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  const result = await pool.query(query, params);
  // Định dạng lại trường departure_time thành HH:mm
  const trips = result.rows.map(trip => ({
    ...trip,
    departure_time: trip.departure_time ? new Date(trip.departure_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : null
  }));
  return trips;
}
