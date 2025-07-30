import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from "../model/routeModel.js";

export async function createRouteHandler(req, res) {
  const { departure, destination } = req.body;
  try {
    const route = await createRoute(departure, destination);
    res.status(201).json(route);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Tạo tuyến xe thất bại", error: err.message });
  }
}

export async function getAllRoutesHandler(req, res) {
  try {
    const routes = await getAllRoutes();
    res.json(routes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lấy danh sách tuyến xe thất bại", error: err.message });
  }
}

export async function getRouteByIdHandler(req, res) {
  try {
    const route = await getRouteById(req.params.id);
    if (!route)
      return res.status(404).json({ message: "Không tìm thấy tuyến xe" });
    res.json(route);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lấy tuyến xe thất bại", error: err.message });
  }
}

export async function updateRouteHandler(req, res) {
  const { departure, destination } = req.body;
  try {
    const route = await updateRoute(req.params.id, departure, destination);
    if (!route)
      return res.status(404).json({ message: "Không tìm thấy tuyến xe" });
    res.json(route);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cập nhật tuyến xe thất bại", error: err.message });
  }
}

export async function deleteRouteHandler(req, res) {
  try {
    await deleteRoute(req.params.id);
    res.json({ message: "Xóa tuyến xe thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Xóa tuyến xe thất bại", error: err.message });
  }
}
