import Image from 'next/image'

export default function PopularRoutes() {
  const routes = [
    {
      id: 1,
      image: '/asset/image/banner.png',
      vehicleType: 'Limosine 10 chỗ',
      isVip: true,
      from: 'Đà Nẵng',
      to: 'Hà Nội',
      distance: '123km',
      duration: '12h',
      price: '123.000đ'
    },
    {
      id: 2,
      image: '/asset/image/banner.png',
      vehicleType: 'Limosine 10 chỗ',
      isVip: true,
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Nẵng',
      distance: '150km',
      duration: '15h',
      price: '150.000đ'
    },
    {
      id: 3,
      image: '/asset/image/banner.png',
      vehicleType: 'Limosine 10 chỗ',
      isVip: true,
      from: 'Hà Nội',
      to: 'TP. Hồ Chí Minh',
      distance: '200km',
      duration: '18h',
      price: '200.000đ'
    },
    {
      id: 4,
      image: '/asset/image/banner.png',
      vehicleType: 'Limosine 10 chỗ',
      isVip: true,
      from: 'Huế',
      to: 'Đà Nẵng',
      distance: '100km',
      duration: '8h',
      price: '100.000đ'
    }
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Các tuyến phổ biến</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white shadow-lg overflow-hidden flex flex-col"
              style={{ width: 260, borderRadius: 10, margin: '12px' }}
            >
              {/* Ảnh thực tế bo góc trên */}
              <div className="relative w-full" style={{ height: 100 }}>
                <Image
                  src={route.image}
                  alt={route.from + ' - ' + route.to}
                  fill
                  className="object-cover w-full h-full"
                  style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                />
              </div>
              {/* Nội dung card */}
              <div className="p-3 flex-1 flex flex-col">
                {/* Loại xe và VIP */}
                <div className="flex items-center justify-between mb-1">
                  <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded font-medium">{route.vehicleType}</span>
                  {route.isVip && (
                    <span className="bg-[#B2E6FF] text-sky-600 text-[11px] px-2 py-0.5 rounded-lg font-bold">VIP</span>
                  )}
                </div>
                {/* Radio dọc + nút đặt vé */}
                <div className="flex items-start gap-2 mb-1">
                  <div className="flex flex-col items-start gap-1">
                    <label className="flex items-center gap-1">
                      <span className="inline-block w-5 h-5 rounded-full border-2 border-sky-500 bg-white flex items-center justify-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full block"></span>
                      </span>
                      <span className="text-[13px] font-bold text-gray-800">{route.from}</span>
                    </label>
                    {/* Icon mũi tên lên xuống */}
                    <span className="flex flex-col items-center ml-2">
                      <svg width="16" height="24" viewBox="0 0 18 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0V28M9 28L3 22M9 28L15 22" stroke="#BDBDBD" strokeWidth="2"/>
                      </svg>
                    </span>
                    <label className="flex items-center gap-1">
                      <span className="inline-block w-5 h-5 rounded-full border-2 border-sky-500 bg-white flex items-center justify-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full block"></span>
                      </span>
                      <span className="text-[13px] font-bold text-gray-800">{route.to}</span>
                    </label>
                  </div>
                  {/* Nút đặt vé */}
                  <button className="bg-sky-500 text-white font-bold text-[15px] px-5 py-2 rounded-xl shadow ml-2 mt-1 whitespace-nowrap hover:bg-sky-600">Đặt vé</button>
                </div>
                {/* Gạch ngang dashed xanh */}
                <div className="border-b border-dashed border-sky-400 mb-1"></div>
                {/* Info icons */}
                <div className="flex items-center justify-between text-xs text-gray-700 mt-1">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/></svg>
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
                    <span>{route.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
