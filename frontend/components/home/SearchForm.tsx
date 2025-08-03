'use client'

import { FaLocationArrow, FaExchangeAlt, FaMapMarkerAlt, FaCalendarAlt, FaPlus } from 'react-icons/fa';

export default function SearchForm() {
  return (
    <div className="w-full flex justify-center items-center mt-[-50px] mb-8 z-20 relative px-4 ">
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] gap-4">
        {/* Group input */}
        <form className="flex flex-col sm:flex-row flex-1 min-w-0 items-stretch bg-white rounded-2xl shadow-lg border border-gray-300 overflow-hidden ">
          {/* Điểm đi */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-lg sm:text-xl lg:text-2xl min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] bg-white">
            <FaLocationArrow className="text-sky-500 mr-2 sm:mr-3 lg:mr-4 text-xl sm:text-2xl lg:text-3xl" />
            <span className="text-gray-500 whitespace-nowrap font-semibold text-sm sm:text-base lg:text-lg">Chọn điểm đi</span>
          </div>
          {/* Icon đối chiếu */}
          <div className="flex items-center px-3 sm:px-4 lg:px-6 border-l border-gray-200 bg-white">
            <FaExchangeAlt className="text-gray-400 text-xl sm:text-2xl lg:text-3xl" />
          </div>
          {/* Điểm đến */}
          <div className="flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-l border-gray-200 min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] bg-white">
            <FaMapMarkerAlt className="text-red-500 mr-2 sm:mr-3 lg:mr-4 text-xl sm:text-2xl lg:text-3xl" />
            <span className="text-gray-500 whitespace-nowrap font-semibold text-sm sm:text-base lg:text-lg">Chọn điểm đến</span>
          </div>
          {/* Ngày đi - ẩn trên mobile */}
          <div className="hidden sm:flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-l border-gray-200 min-w-[160px] sm:min-w-[180px] lg:min-w-[200px] bg-white">
            <FaCalendarAlt className="text-sky-500 mr-2 sm:mr-3 lg:mr-4 text-xl sm:text-2xl lg:text-3xl" />
            <span className="text-gray-500 whitespace-nowrap font-semibold text-sm sm:text-base lg:text-lg">Ngày đi</span>
          </div>
          {/* Thêm ngày về - ẩn trên mobile */}
          <div className="hidden lg:flex items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-l border-gray-200 min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] bg-white">
            <FaPlus className="text-sky-500 mr-2 sm:mr-3 lg:mr-4 text-lg sm:text-xl lg:text-2xl" />
            <span className="text-sky-500 font-bold whitespace-nowrap text-sm sm:text-base lg:text-xl">+ Thêm ngày về</span>
          </div>
        </form>
        {/* Nút Tìm Chuyến */}
        <a href="/search-results">
          <button
            type="button"
            className="px-6 sm:px-8 lg:px-12 flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg sm:text-xl lg:text-2xl rounded-2xl shadow h-[60px] sm:h-[68px] lg:h-[76px] min-w-[120px] sm:min-w-[160px] lg:min-w-[220px]"
          >
            Tìm Chuyến
          </button>
        </a>
      </div>
    </div>
  );
}
