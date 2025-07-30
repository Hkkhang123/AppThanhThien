"use client";
import Link from 'next/link';
import { useState } from 'react';
import { loginApi } from '../../services/auth';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
      window.location.href = '/';
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Lỗi kết nối máy chủ!');
      } else {
        setError('Lỗi kết nối máy chủ!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-white">
      {/* Left pane */}
      <div className="w-2/5 bg-[#049BD2] text-white flex flex-col items-center justify-center rounded-tr-[80px] rounded-br-[80px] p-8">
        <h1 className="text-3xl font-bold mb-4">Thanh Thiện xin chào!</h1>
        <p className="mb-4">Bạn chưa có tài khoản?</p>
        <Link href="/register/">
        <button className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#049BD2] transition">
          Đăng kí
        </button>
        </Link>
      </div>

      {/* Right pane */}
      <div className="w-3/5 flex flex-col items-center justify-center px-10 text-black">
        <img src="/asset/image/logott-Photoroom.png" alt="Logo" className="w-32 mb-6" />
        <h2 className="text-2xl font-semibold mb-6">Đăng nhập</h2>

        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="w-full px-4 py-2 pl-12 bg-[#DCE0E3] text-black border rounded focus:outline-blue-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <img src="/asset/image/profileicon.png" alt="Profile" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
          <div className="relative mb-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 pl-12 bg-[#DCE0E3] text-black border rounded focus:outline-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <img src="/asset/image/passwordicon.png" alt="Password" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>

          <div className="w-full text-right text-sm text-black mb-4 hover:text-[#049BD2] transition">
            <a href="#">Quên mật khẩu?</a>
          </div>

          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#049BD2] text-white py-2 rounded hover:bg-[#0389b8] mb-4 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-gray-500 mb-2">Hoặc đăng nhập với</p>
        <div className="flex gap-4">
          <button className="w-12 h-12 flex items-center justify-center">
            <img src="/asset/image/fbicon.png" alt="Facebook" className="w-8 h-8" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center">
            <img src="/asset/image/ggicon.png" alt="Google" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
