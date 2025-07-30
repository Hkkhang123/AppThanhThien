import { createFeedback, getAllFeedbacks, getFeedbackById, updateFeedbackStatus, deleteFeedback } from '../model/feedbackModel.js';

export async function createFeedbackHandler(req, res) {
  try {
    const user_id = req.user ? req.user.id : null;
    const { name, email, phone, content, type } = req.body;
    if (!content || !name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên và nội dung phản hồi.' });
    }
    const feedback = await createFeedback(user_id, name, email, phone, content, type);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Gửi phản hồi thất bại', error: err.message });
  }
}

export async function getAllFeedbacksHandler(req, res) {
  try {
    const feedbacks = await getAllFeedbacks();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Lấy danh sách phản hồi thất bại', error: err.message });
  }
}

export async function getFeedbackByIdHandler(req, res) {
  try {
    const feedback = await getFeedbackById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Lấy phản hồi thất bại', error: err.message });
  }
}

export async function updateFeedbackStatusHandler(req, res) {
  try {
    const { status } = req.body;
    const feedback = await updateFeedbackStatus(req.params.id, status);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật trạng thái thất bại', error: err.message });
  }
}

export async function deleteFeedbackHandler(req, res) {
  try {
    await deleteFeedback(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Xóa phản hồi thất bại', error: err.message });
  }
} 