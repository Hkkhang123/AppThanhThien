"use client";
import Link from 'next/link';
import { useState } from 'react';
import { forgotPasswordApi } from '../../services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const response = await forgotPasswordApi(email);
      setMessage('Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
      // Redirect to OTP page after successful email send
      setTimeout(() => {
        window.location.href = `/otp?email=${encodeURIComponent(email)}`;
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gửi OTP thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/asset/image/forgetPassword.png)' }}
      />
      
      {/* Overlay - beige/off-white */}
      <div className="absolute inset-0 bg-beige-50 bg-opacity-70" />
      
      {/* Content Container - không có nền trắng */}
      <div className="relative z-10 p-12 max-w-lg w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-4">
            Quên mật khẩu
          </h1>
          
          <p className="text-black mb-6 text-sm">
            Nhập Email của bạn để lấy lại mật khẩu
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 pl-12 bg-gray-100 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img 
                src="/asset/image/emailicon.png" 
                alt="Email" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            {message && (
              <div className="text-green-600 text-sm bg-green-100 p-3 rounded-lg">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-[#049BD2] text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Xác nhận'}
            </button>
          </form>
          
          <div className="mt-6">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 text-sm transition duration-200"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 