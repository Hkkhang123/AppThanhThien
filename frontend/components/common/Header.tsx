"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Header() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown') && !target.closest('.language-dropdown') && !target.closest('.mobile-menu')) {
        setIsUserDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <div className="flex items-center min-w-[80px] md:min-w-[100px]">
          <Image
            src="/asset/image/logott-Photoroom.png"
            alt="Logo Thanh Thiện"
            width={60}
            height={40}
            className="object-contain w-12 md:w-auto"
            priority
          />
        </div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex flex-1 items-center ml-6">
          <ul className="flex space-x-4 lg:space-x-6 text-[14px] lg:text-[15px] font-medium">
            <li><Link href="/">Trang chủ</Link></li>
            <li><a href="#">Tra cứu đơn hàng</a></li>
            <li><a href="#">Dịch vụ</a></li>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </nav>
        
        {/* Desktop Language + Login/User */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center border rounded px-3 py-1 bg-white text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none"
            >
              <span className="mr-1">Tiếng việt</span>
              <span className="w-5 h-5 mr-1"><Image src="/asset/image/vnflag.png" alt="VN" width={20} height={20} /></span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border">
                <div className="py-1">
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">Tiếng việt</button>
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">English</button>
                </div>
              </div>
            )}
          </div>
          {/* User/Login Button */}
          {user ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 bg-[#049BD2] rounded-full hover:bg-[#0389b8] transition"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border">
                  <div className="py-2">
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Tài khoản của tôi
                    </button>
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Lịch sử đặt vé
                    </button>
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Ưu đãi
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="ml-2 px-5 py-1.5 border border-black rounded-full font-bold bg-white hover:bg-gray-100 transition text-[15px] shadow-sm">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Language */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center border rounded px-2 py-1 bg-white text-xs font-medium shadow-sm hover:border-blue-400 focus:outline-none"
            >
              <span className="mr-1">VN</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-50 border">
                <div className="py-1">
                  <button className="block w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 text-left">Tiếng việt</button>
                  <button className="block w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 text-left">English</button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile User/Login */}
          {user ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center justify-center w-8 h-8 bg-[#049BD2] rounded-full hover:bg-[#0389b8] transition"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 border">
                  <div className="py-2">
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Tài khoản của tôi
                    </button>
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Lịch sử đặt vé
                    </button>
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                      Ưu đãi
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="px-3 py-1 border border-black rounded-full font-bold bg-white hover:bg-gray-100 transition text-xs shadow-sm">
                Đăng nhập
              </button>
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu bg-white border-t border-gray-200">
          <nav className="px-4 py-3">
            <ul className="space-y-3">
              <li><Link href="/" className="block py-2 text-gray-700 hover:text-[#049BD2]">Trang chủ</Link></li>
              <li><a href="#" className="block py-2 text-gray-700 hover:text-[#049BD2]">Tra cứu đơn hàng</a></li>
              <li><a href="#" className="block py-2 text-gray-700 hover:text-[#049BD2]">Dịch vụ</a></li>
              <li><a href="#" className="block py-2 text-gray-700 hover:text-[#049BD2]">Giới thiệu</a></li>
              <li><a href="#" className="block py-2 text-gray-700 hover:text-[#049BD2]">Liên hệ</a></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
