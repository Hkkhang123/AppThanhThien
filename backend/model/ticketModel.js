import pool from "../config/db.js";

export async function createTicket(
  user_id,
  trip_id,
  seat_number,
  payment_method,
  payment_status,
  qr_code,
  full_name,
  phone,
  email,
  discount_code,
  pickup_point_id,
  dropoff_point_id
) {
  const result = await pool.query(
    `INSERT INTO tickets (
      user_id, trip_id, seat_number, payment_method, payment_status, qr_code,
      full_name, phone, email, discount_code, pickup_point_id, dropoff_point_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      user_id, trip_id, seat_number, payment_method, payment_status, qr_code,
      full_name, phone, email, discount_code, pickup_point_id, dropoff_point_id
    ]
  );
  return result.rows[0];
}

export async function getTicketsByUser(user_id) {
  const result = await pool.query("SELECT * FROM tickets WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows;
}

export async function getTicketById(id) {
  const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [id]);
  return result.rows[0];
}

export async function getTicketByQRCode(qr_code) {
  const result = await pool.query("SELECT * FROM tickets WHERE qr_code = $1", [
    qr_code,
  ]);
  return result.rows[0];
}

export async function getBookedSeatsByTrip(trip_id) {
  const result = await pool.query('SELECT seat_number FROM tickets WHERE trip_id = $1', [trip_id]);
  return result.rows.map(row => row.seat_number);
}

export async function getTicketByQRCodeAndPhone(qr_code, phone) {
  const result = await pool.query('SELECT * FROM tickets WHERE qr_code = $1 AND phone = $2', [qr_code, phone]);
  return result.rows[0];
}

export async function deleteTicket(id) {
  await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
  return true;
}

export async function getAllTicketsAdmin({ payment_status, route_id, date }) {
  let query = `SELECT tickets.*, trips.route_id, trips.departure_time FROM tickets JOIN trips ON tickets.trip_id = trips.id WHERE 1=1`;
  const params = [];
  let idx = 1;
  if (payment_status) {
    query += ` AND tickets.payment_status = $${idx++}`;
    params.push(payment_status);
  }
  if (route_id) {
    query += ` AND trips.route_id = $${idx++}`;
    params.push(route_id);
  }
  if (date) {
    query += ` AND DATE(trips.departure_time) = $${idx++}`;
    params.push(date);
  }
  query += ' ORDER BY tickets.created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

export async function updateTicketPaymentStatus(id, payment_status) {
  const result = await pool.query('UPDATE tickets SET payment_status = $2 WHERE id = $1 RETURNING *', [id, payment_status]);
  return result.rows[0];
}
