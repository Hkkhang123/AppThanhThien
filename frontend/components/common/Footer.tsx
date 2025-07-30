import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-10 pb-0">
      <div className="container mx-auto px-4 pb-8 flex flex-col md:flex-row gap-8">
        {/* Cột 1: Logo + Thông tin công ty */}
        <div className="flex-1 min-w-[260px]">
          <div className="mb-4 flex flex-col items-start">
            <Image
              src="/asset/image/logott-Photoroom.png"
              alt="Logo Thanh Thiện"
              width={150}
              height={150}
              className="object-contain mb-2"
            />
            <span className="text-sky-600 font-bold text-lg">HOTLINE: 0867 75 79 75</span>
          </div>
          <div className="mb-4">
            <div className="font-bold text-lg mb-2">Công ty Thanh Thiện</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Giấy chứng nhận ĐKKD số xxxxxxxx, đăng ký lần đầu ngày xx/xx/20xx, đăng ký thay đổi lần thứ xx ngày xx/xx/20xx, cấp bởi Sở KHĐT tỉnh xxx</li>
              <li>Địa chỉ ĐKKD: Số xx, phường xx, Thành Phố xx, Tỉnh xx, Việt Nam</li>
              <li>CSKH: 0123456789</li>
              <li>Email: <a href="mailto:support@thanhthiencar.com" className="underline text-sky-600">support@thanhthiencar.com</a></li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-2">Theo dõi chúng tôi tại:</div>
            <div className="flex space-x-2">
              <Image src="/asset/image/zalo.png" alt="Zalo" width={36} height={36} className="object-contain" />
              <Image src="/asset/image/facebookIcon.png" alt="Facebook" width={36} height={36} className="object-contain" />
            </div>
          </div>
          <button className="w-full bg-sky-400 text-white font-bold py-3 rounded-lg mt-2 text-base flex items-center justify-center">
            <span className="mr-2">Tổng đài đặt vé:</span>
            <span className="text-white font-bold text-lg">0912342151</span>
          </button>
        </div>

        {/* Cột 2: Hotline & Địa chỉ */}
        <div className="flex-1 min-w-[260px]">
          <div className="font-bold text-2xl text-black mb-2">Hotline</div>
          <div className="text-gray-700 text-sm mb-4">
            Giấy chứng nhận ĐKKD số xxxxxxxx, đăng ký lần đầu ngày xx/xx/20xx, đăng ký thay đổi lần thứ xx ngày xx/xx/20xx, cấp bởi Sở KHĐT tỉnh xxx<br />
            Địa chỉ ĐKKD: Số xx, phường xx, Thành Phố xx, Tỉnh xx, Việt Nam<br />
            CSKH: 0123456789<br />
            Email: <a href="mailto:support@thanhthiencar.com" className="underline text-sky-600">support@thanhthiencar.com</a>
          </div>
          <div className="font-bold text-2xl text-black mb-2">Địa chỉ</div>
          <div className="text-gray-700 text-sm mb-2">Địa chỉ ĐKKD: Số xx, phường xx, Thành Phố xx, Tỉnh xx, Việt Nam</div>
          <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <span className="text-gray-500">Bản đồ Google Maps</span>
          </div>
        </div>

        {/* Cột 3: Facebook */}
        <div className="flex-1 min-w-[260px]">
          <div className="font-bold text-lg text-black mb-2">Theo dõi trang Facebook của Thanh Thiện để nhận khuyến mãi và tin tức mới nhất.</div>
          <div className="rounded-lg p-2">
            <Image src="/asset/image/facebook.png" alt="Facebook Page" width={320} height={180} className="object-contain rounded" />
          </div>
        </div>
      </div>
      <div className="bg-sky-600 py-3 text-center text-white text-sm font-semibold">
        Bản quyền © 2025 ThanhThien
      </div>
    </footer>
  )
}
