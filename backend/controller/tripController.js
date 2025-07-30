import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  searchTrips,
} from "../model/tripModel.js";
import { getVehicleById, getAmenitiesByVehicleId, getVehicleImages } from '../model/vehicleModel.js';
import { getPickupPointsByTripId, getDropoffPointsByTripId } from '../model/routeModel.js';
import { getPolicyByTripId } from '../model/policyModel.js';

export async function createTripHandler(req, res) {
  const {
    route_id,
    departure_time,
    vehicle_type,
    price,
    total_seats,
    available_seats,
  } = req.body;
  try {
    const trip = await createTrip(
      route_id,
      departure_time,
      vehicle_type,
      price,
      total_seats,
      available_seats
    );
    res.status(201).json(trip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Tạo chuyến xe thất bại", error: err.message });
  }
}

export async function getAllTripsHandler(req, res) {
  try {
    const trips = await getAllTrips();
    res.json(trips);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Lấy danh sách chuyến xe thất bại",
        error: err.message,
      });
  }
}

export async function getTripByIdHandler(req, res) {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip)
      return res.status(404).json({ message: "Không tìm thấy chuyến xe" });

    // Lấy thông tin xe, tiện ích, ảnh
    let vehicle = null;
    let amenities = [];
    let images = [];
    if (trip.vehicle_id) {
      vehicle = await getVehicleById(trip.vehicle_id);
      amenities = await getAmenitiesByVehicleId(trip.vehicle_id);
      images = await getVehicleImages(trip.vehicle_id);
    }
    // Lấy lộ trình
    const pickup_points = await getPickupPointsByTripId(trip.id);
    const dropoff_points = await getDropoffPointsByTripId(trip.id);
    // Lấy chính sách
    const policy = await getPolicyByTripId(trip.id);

    res.json({
      ...trip,
      vehicle,
      amenities,
      images,
      pickup_points,
      dropoff_points,
      policy,
      image_url: vehicle ? vehicle.image_url : null
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lấy chuyến xe thất bại", error: err.message });
  }
}

export async function updateTripHandler(req, res) {
  const {
    route_id,
    departure_time,
    vehicle_type,
    price,
    total_seats,
    available_seats,
  } = req.body;
  try {
    const trip = await updateTrip(
      req.params.id,
      route_id,
      departure_time,
      vehicle_type,
      price,
      total_seats,
      available_seats
    );
    if (!trip)
      return res.status(404).json({ message: "Không tìm thấy chuyến xe" });
    res.json(trip);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cập nhật chuyến xe thất bại", error: err.message });
  }
}

export async function deleteTripHandler(req, res) {
  try {
    await deleteTrip(req.params.id);
    res.json({ message: "Xóa chuyến xe thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Xóa chuyến xe thất bại", error: err.message });
  }
}

export async function searchTripsHandler(req, res) {
  const { departure, destination, date } = req.query;
  try {
    if (!departure && !destination && !date) {
      return res.status(400).json({ message: 'Cần nhập ít nhất một tiêu chí tìm kiếm (điểm đi, điểm đến hoặc ngày đi)' });
    }
    // Kiểm tra định dạng ngày đi nếu có nhập
    if (date) {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ message: 'Định dạng ngày đi không hợp lệ. Định dạng đúng: DD-MM-YYYY' });
      }
    }
    const trips = await searchTrips(departure, destination, date);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Tìm kiếm chuyến xe thất bại', error: err.message });
  }
}
