import { createUser, findUserById, updateUserProfile, getAllStaff, updateStaff, deleteUser } from '../model/userModel.js';

export async function getProfileHandler(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json({ id: user.id, username: user.username, email: user.email, phone: user.phone, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Lấy thông tin cá nhân thất bại', error: err.message });
  }
}

export async function updateProfileHandler(req, res) {
  const userId = req.user.id;
  const { username, email, phone } = req.body;
  try {
    // Cập nhật thông tin user
    const updatedUser = await updateUserProfile(userId, username, email, phone);
    res.json({ message: 'Cập nhật hồ sơ thành công', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật hồ sơ thất bại', error: err.message });
  }
}

export async function createStaffHandler(req, res) {
  const { username, password, email, phone } = req.body;
  try {
    // Kiểm tra trùng username/email/phone
    const existingUser = await findUserById(username) || await findUserById(email) || await findUserById(phone);
    if (existingUser) return res.status(400).json({ message: 'Username, email hoặc phone đã tồn tại' });
    const staff = await createUser(username, password, 'staff', email, phone);
    res.status(201).json({ message: 'Tạo nhân viên thành công', staff });
  } catch (err) {
    res.status(500).json({ message: 'Tạo nhân viên thất bại', error: err.message });
  }
}

export async function getAllStaffHandler(req, res) {
  try {
    const staffList = await getAllStaff();
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ message: 'Lấy danh sách nhân viên thất bại', error: err.message });
  }
}

export async function updateStaffHandler(req, res) {
  const { email, phone } = req.body;
  try {
    const staff = await updateStaff(req.params.id, email, phone);
    res.json({ message: 'Cập nhật nhân viên thành công', staff });
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật nhân viên thất bại', error: err.message });
  }
}

export async function deleteStaffHandler(req, res) {
  try {
    await deleteUser(req.params.id);
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xóa nhân viên thất bại', error: err.message });
  }
} 