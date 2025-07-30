import Image from 'next/image'

export default function Banner() {
  return (
    <div className="relative h-96 flex flex-col justify-center items-start">
      {/* Background Banner Image */}
      <Image
        src="/asset/image/banner.png"
        alt="Banner Xe Thanh Thiện"
        fill
        className="object-cover w-full h-full absolute inset-0 z-0"
        priority
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-blue-400/10 z-10" />
      {/* Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-center text-left text-white pl-16 md:pl-24 lg:pl-32 w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow">
          Hành trình tiện lợi với<br />Thanh Thiện
        </h1>
      </div>
    </div>
  )
}
