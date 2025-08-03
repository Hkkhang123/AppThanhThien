"use client";
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Checkmark Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto border-4 border-[#049BD2] rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-[#049BD2]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#049BD2] mb-4">
          Thành công
        </h1>
        
        {/* Description */}
        <p className="text-gray-500 mb-8 text-sm">
          Mật khẩu của bạn đã được thay đổi thành công
        </p>
        
        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#049BD2] text-white py-4 rounded-lg hover:bg-[#0389b8] transition duration-200 font-medium"
        >
          TIẾP TỤC
        </button>
      </div>
    </div>
  );
} 