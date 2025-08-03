import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByIdentity } from "../model/userModel.js";
import nodemailer from 'nodemailer';
import { setResetOTP, verifyResetOTP, updatePasswordByEmail } from '../model/userModel.js';

function isValidPassword(password) {
  // 1. Kiểm tra độ dài
  if (password.length < 6 || password.length > 20) {
    return { valid: false, message: "Mật khẩu phải từ 6-20 ký tự." };
  }
  // 2. Kiểm tra ký tự đầu tiên phải là chữ in hoa
  if (!/^[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Mật khẩu phải bắt đầu bằng chữ cái in hoa.",
    };
  }
  // 3. Kiểm tra mật khẩu chỉ chứa các ký tự chữ và số (không có ký tự đặc biệt)
  if (/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Mật khẩu chỉ được chứa chữ cái và số." };
  }
  return { valid: true };
}

function isValidEmail(email) {
  // Regex kiểm tra email cơ bản
  return /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

export async function register(req, res) {
  const { username, password, email, phone } = req.body;
  try {
    // Kiểm tra mật khẩu
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }
    // Kiểm tra email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email không hợp lệ." });
    }
    const existingUser =
      (await findUserByIdentity(username)) ||
      (await findUserByIdentity(email)) ||
      (await findUserByIdentity(phone));
    if (existingUser)
      return res
        .status(400)
        .json({
          message: "Tên đăng nhập, Email hoặc số điện thoại đã tồn tại",
        });
    // Luôn set role là 'user'
    const user = await createUser(username, password, "user", email, phone);
    
    // Tạo token sau khi đăng ký thành công
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    res
      .status(201)
      .json({
        message: "User registered",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
          phone: user.phone,
        },
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
}

export async function login(req, res) {
  const { identity, password } = req.body; // identity có thể là username, email hoặc phone
  try {
    const user = await findUserByIdentity(identity);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

export async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });
    // Sinh OTP 4 số
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    const updatedCount = await setResetOTP(email, otp, expires);

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã OTP đặt lại mật khẩu',
      text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 10 phút.`
    });
    res.json({ message: 'Đã gửi OTP về email' });
  } catch (err) {
    res.status(500).json({ message: 'Gửi OTP thất bại', error: err.message });
  }
}

export async function verifyOtpHandler(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Thiếu thông tin email hoặc OTP' });
    
    const user = await verifyResetOTP(email, otp);
    if (!user) return res.status(400).json({ message: 'OTP không đúng hoặc đã hết hạn' });
    
    // Create a short-lived token for password reset
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '10m' } // 10 minutes validity
    );

    res.json({ message: 'OTP hợp lệ', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Xác thực OTP thất bại', error: err.message });
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin token hoặc mật khẩu mới' });

    // Kiểm tra mật khẩu mới
    const passwordCheck = isValidPassword(newPassword);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const { email } = decoded;
    
    await updatePasswordByEmail(email, newPassword);
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Đổi mật khẩu thất bại', error: err.message });
  }
}