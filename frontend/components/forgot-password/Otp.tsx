"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtpApi, forgotPasswordApi } from '../../services/auth';

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const otpString = otp.join('');
      const data = await verifyOtpApi(email, otpString);
      sessionStorage.setItem('resetToken', data.resetToken);
      router.push('/reset-password');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Xác thực OTP thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await forgotPasswordApi(email);
      setTimer(30);
      setOtp(['', '', '', '']);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gửi lại OTP thất bại');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#049BD2] mb-2">
            Mã xác nhận
          </h1>
          
          <p className="text-gray-500 mb-8 text-sm">
            Nhập mã xác nhận được gửi đến Email của bạn!
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 mb-6 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-xl font-semibold border border-[#049BD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#049BD2] focus:border-[#049BD2]"
                />
              ))}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-100 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="text-center mb-8">
              <span className="text-red-500 text-sm">
                {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : '00:00'}
              </span>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#049BD2] text-white py-4 rounded-lg hover:bg-[#0389b8] transition duration-200 font-medium disabled:opacity-60 mb-6"
              disabled={loading || otp.join('').length !== 4}
            >
              {loading ? 'Đang xác nhận...' : 'TIẾP TỤC'}
            </button>
          </form>
          
          <div className="text-center">
            <span className="text-gray-500 text-sm">
              Bạn chưa nhận được mã?{' '}
            </span>
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className="text-red-500 underline text-sm hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 