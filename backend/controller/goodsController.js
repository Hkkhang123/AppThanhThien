import { createGoods, getGoodsByUser, getGoodsById, getGoodsByPhone, deleteGoods, getAllGoodsAdmin, updateGoodsDeliveryStatus } from '../model/goodsModel.js';

export async function createGoodsHandler(req, res) {
  const { name, weight, price, payment_method, delivery_status, phone } = req.body;
  const user_id = req.user ? req.user.id : null;
  try {
    if (!name || !phone) {
      return res.status(400).json({ message: 'Vui lòng nhập tên hàng hóa và số điện thoại.' });
    }
    const goods = await createGoods(user_id, name, weight, price, payment_method, delivery_status || 'pending', phone);
    res.status(201).json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Tạo đơn hàng thất bại', error: err.message });
  }
}

export async function getUserGoodsHandler(req, res) {
  const user_id = req.user.id;
  try {
    const goods = await getGoodsByUser(user_id);
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Lấy đơn hàng thất bại', error: err.message });
  }
}

export async function getGoodsByIdHandler(req, res) {
  try {
    const goods = await getGoodsById(req.params.id);
    if (!goods) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Lấy đơn hàng thất bại', error: err.message });
  }
}

export async function getGoodsByPhoneHandler(req, res) {
  const { phone } = req.query;
  try {
    if (!phone) return res.status(400).json({ message: 'Thiếu số điện thoại' });
    const goods = await getGoodsByPhone(phone);
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Tra cứu đơn hàng thất bại', error: err.message });
  }
}

export async function deleteGoodsHandler(req, res) {
  try {
    const goods = await getGoodsById(req.params.id);
    if (!goods) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    // Chỉ cho phép user sở hữu đơn hoặc admin hủy
    if (req.user.role !== 'admin' && req.user.id !== goods.user_id) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
    }
    await deleteGoods(req.params.id);
    res.json({ message: 'Hủy đơn hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Hủy đơn hàng thất bại', error: err.message });
  }
}

export async function cancelGoodsHandler(req, res) {
  const goodsId = req.params.id;
  const userId = req.user.id;
  try {
    const goods = await getGoodsById(goodsId);
    if (!goods) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    // Chỉ cho phép user sở hữu đơn hoặc admin hủy
    if (req.user.role !== 'admin' && goods.user_id !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn hàng này' });
    }
    await deleteGoods(goodsId);
    res.json({ message: 'Hủy đơn hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Hủy đơn hàng thất bại', error: err.message });
  }
}

export async function getAllGoodsAdminHandler(req, res) {
  try {
    const { delivery_status, phone } = req.query;
    const goods = await getAllGoodsAdmin({ delivery_status, phone });
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Lấy danh sách đơn hàng thất bại', error: err.message });
  }
}

export async function updateGoodsDeliveryStatusHandler(req, res) {
  try {
    const goods_id = req.params.id;
    const { delivery_status } = req.body;
    if (!delivery_status) return res.status(400).json({ message: 'Thiếu trạng thái giao hàng' });
    const goods = await updateGoodsDeliveryStatus(goods_id, delivery_status);
    if (!goods) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(goods);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật trạng thái giao hàng thất bại', error: err.message });
  }
}

export async function quickQuoteHandler(req, res) {
  try {
    const { weight, distance, goods_type } = req.body;
    // Thiết lập phí mẫu
    const base_fee = 20000; // phí cơ bản
    const weight_fee = 3000; // phí mỗi kg
    const distance_fee = 5000; // phí mỗi 10km
    // Tính phí
    const w = Number(weight) || 0;
    const d = Number(distance) || 0;
    let type_fee = 0;
    if (goods_type === 'fragile') type_fee = 10000;
    if (goods_type === 'express') type_fee = 20000;
    const price = base_fee + (w * weight_fee) + (Math.ceil(d/10) * distance_fee) + type_fee;
    res.json({ estimated_price: price });
  } catch (err) {
    res.status(500).json({ message: 'Tính cước thất bại', error: err.message });
  }
} 