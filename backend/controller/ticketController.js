import {
  createTicket,
  getTicketsByUser,
  getTicketById,
  getTicketByQRCode,
  getBookedSeatsByTrip,
  getTicketByQRCodeAndPhone,
  getAllTicketsAdmin,
  updateTicketPaymentStatus,
} from "../model/ticketModel.js";
import { getTripById, updateTrip } from "../model/tripModel.js";
import crypto from "crypto";
import QRCode from "qrcode";

export async function bookTicketHandler(req, res) {
  const {
    trip_id,
    seat_count,
    seat_numbers, // mảng số ghế
    payment_method,
    payment_status,
    full_name,
    phone,
    email,
    discount_code,
    pickup_point_id,
    dropoff_point_id
  } = req.body;
  const user_id = req.user ? req.user.id : null; // Nếu có đăng nhập
  try {
    if (!Array.isArray(seat_numbers) || seat_numbers.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất một ghế." });
    }
    // Nếu là khách vãng lai, kiểm tra các trường bắt buộc
    if (!user_id) {
      if (!full_name || !phone || !email) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và email." });
      }
    }
    // Kiểm tra chuyến xe còn đủ ghế không
    const trip = await getTripById(trip_id);
    if (!trip)
      return res.status(404).json({ message: "Không tìm thấy chuyến xe" });
    if (trip.available_seats < seat_numbers.length)
      return res.status(400).json({ message: "Không đủ ghế trống cho số lượng ghế đã chọn" });
    // Lấy danh sách ghế đã đặt
    const bookedSeats = await getBookedSeatsByTrip(trip_id);
    const duplicate = seat_numbers.find(seat => bookedSeats.includes(seat));
    if (duplicate) {
      return res.status(400).json({ message: `Ghế số ${duplicate} đã được đặt, vui lòng chọn ghế khác.` });
    }
    // Xử lý mã giảm giá (giả lập: GIAM10 giảm 10%)
    let final_price = trip.price;
    let discount = 0;
    if (discount_code && discount_code === "GIAM10") {
      discount = Math.round(trip.price * 0.1);
      final_price = trip.price - discount;
    }
    // Tạo vé cho từng ghế
    const tickets = [];
    for (const seat_number of seat_numbers) {
      // Sinh mã QR ngẫu nhiên
      const qr_code = crypto.randomBytes(8).toString("hex");
      // Tạo ảnh QR code base64
      const qr_image = await QRCode.toDataURL(qr_code);
      const ticket = await createTicket(
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
      );
      tickets.push({ ...ticket, qr_image, final_price, discount });
    }
    // Cập nhật số ghế trống
    await updateTrip(
      trip_id,
      trip.route_id,
      trip.departure_time,
      trip.vehicle_type,
      trip.price,
      trip.total_seats,
      trip.available_seats - seat_numbers.length
    );
    // Trả về danh sách vé và số lượng ghế đã đặt
    res.status(201).json({ tickets, seat_count: tickets.length });
  } catch (err) {
    res.status(500).json({ message: "Đặt vé thất bại", error: err.message });
  }
}

export async function getUserTicketsHandler(req, res) {
  const user_id = req.user.id;
  try {
    const tickets = await getTicketsByUser(user_id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Lấy vé thất bại", error: err.message });
  }
}

export async function getTicketByQRCodeHandler(req, res) {
  const { qr_code } = req.query;
  try {
    const ticket = await getTicketByQRCode(qr_code);
    if (!ticket) return res.status(404).json({ message: "Không tìm thấy vé" });
    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Tra cứu vé thất bại", error: err.message });
  }
}

export async function getBookedSeatsHandler(req, res) {
  const { trip_id } = req.query;
  try {
    if (!trip_id) return res.status(400).json({ message: "Thiếu trip_id" });
    const seats = await getBookedSeatsByTrip(trip_id);
    res.json(seats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lấy danh sách ghế thất bại", error: err.message });
  }
}

export async function lookupTicketHandler(req, res) {
  const { qr_code, phone } = req.query;
  try {
    if (!qr_code || !phone)
      return res
        .status(400)
        .json({ message: "Thiếu mã QR hoặc số điện thoại" });
    const ticket = await getTicketByQRCodeAndPhone(qr_code, phone);
    if (!ticket) return res.status(404).json({ message: "Không tìm thấy vé" });
    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Tra cứu vé thất bại", error: err.message });
  }
}

export async function cancelTicketHandler(req, res) {
  const ticket_id = req.params.id;
  try {
    const ticket = await getTicketById(ticket_id);
    if (!ticket) return res.status(404).json({ message: "Không tìm thấy vé" });
    // Chỉ cho phép user sở hữu vé hoặc admin hủy vé
    if (req.user.role !== "admin" && req.user.id !== ticket.user_id) {
      return res.status(403).json({ message: "Bạn không có quyền hủy vé này" });
    }
    // Lấy thông tin chuyến xe
    const trip = await getTripById(ticket.trip_id);
    // Xóa vé
    // await deleteTicket(ticket_id); // This line was removed from imports, so it's removed here.
    // Cập nhật lại số ghế trống
    await updateTrip(
      trip.id,
      trip.route_id,
      trip.departure_time,
      trip.vehicle_type,
      trip.price,
      trip.total_seats,
      trip.available_seats + 1
    );
    res.json({ message: "Hủy vé thành công" });
  } catch (err) {
    res.status(500).json({ message: "Hủy vé thất bại", error: err.message });
  }
}

export async function getAllTicketsAdminHandler(req, res) {
  try {
    const { payment_status, route_id, date } = req.query;
    const tickets = await getAllTicketsAdmin({
      payment_status,
      route_id,
      date,
    });
    res.json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lấy danh sách vé thất bại", error: err.message });
  }
}

export async function updateTicketPaymentStatusHandler(req, res) {
  try {
    const ticket_id = req.params.id;
    const { payment_status } = req.body;
    if (!payment_status) return res.status(400).json({ message: 'Thiếu trạng thái thanh toán' });
    const ticket = await updateTicketPaymentStatus(ticket_id, payment_status);
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy vé' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật trạng thái thanh toán thất bại', error: err.message });
  }
}
