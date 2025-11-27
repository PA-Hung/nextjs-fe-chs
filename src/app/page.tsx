import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const heroHighlights = [
  { id: 1, text: "Hồ bơi vô cực trên tầng 36, view biển cực đẹp" },
  { id: 2, text: "Sky Gym, Yoga, Sauna & Steam thư giãn trên cao" },
  { id: 3, text: "Công viên nước & hồ bơi trẻ em riêng" },
  { id: 4, text: "Khu game, phòng đọc sách, phòng sinh hoạt chung" },
  { id: 5, text: "Sảnh đón sang trọng chuẩn resort" },
  { id: 6, text: "Shophouse, dịch vụ tiện ích ngay tại khuôn viên chung cư" },
  { id: 7, text: "Bãi đậu xe rộng rãi, an ninh 24/7" },
];

const benefits = [
  {
    title: "Vị trí vàng gần biển",
    desc: "Toạ lạc tại trục đường Thi Sách, chỉ vài phút ra Bãi Sau.",
    icon: "🌊",
  },
  {
    title: "Full tiện ích cao cấp",
    desc: "Hồ bơi tràn, sky bar, sauna, khu vui chơi trẻ em an toàn.",
    icon: "🏢",
  },
  {
    title: "Decor ấm cúng",
    desc: "Căn hộ Japandi phối gỗ và màu beige tạo cảm giác thư thái.",
    icon: "🪑",
  },
  {
    title: "Hỗ trợ nhanh",
    desc: "Nhắn Zalo là có ngay gợi ý căn phù hợp nhu cầu và ngân sách.",
    icon: "💬",
  },
];

const featuredApartments = [
  {
    badge: "Hot",
    name: "The Sóng – Căn hộ 2PN view biển",
    specs: "60m² · 2 phòng ngủ · 2 phòng tắm · Tối đa 6 khách",
    desc: "Tone trắng – gỗ, ban công rộng nhìn thẳng biển, đầy đủ bếp và máy giặt.",
    price: "Từ 800.000đ/đêm",
    image: "/apartment/Havila-Luxury/cover.jpg",
  },
  {
    badge: "View biển",
    name: "The Sóng – Studio ban công lớn",
    specs: "45m² · 1 giường queen · 1 sofa bed · 4 khách",
    desc: "Không gian mở, sofa giường tiện lợi, thích hợp cặp đôi hay nhóm nhỏ.",
    price: "Từ 650.000đ/đêm",
    image: "/apartment/Luxury/z7237609472235_6733988694555911779d29be29b5bea6.jpg",
  },
  {
    badge: "Căn góc",
    name: "The Sóng – 3PN family suite",
    specs: "85m² · 3 phòng ngủ · 2 phòng tắm · 8 khách",
    desc: "Góc view uốn cong nhìn toàn bộ thành phố và biển, bếp lớn, bàn ăn 8 người.",
    price: "Từ 1.400.000đ/đêm",
    image: "/apartment/suite/z7238034656546_2a353c7a9fc9fe0e75c59f1c8f333262.jpg",
  },
];

const amenityList = [
  "Hồ bơi tràn bờ",
  "Khu sauna & jacuzzi",
  "Khu vui chơi trẻ em",
  "Phòng gym & khu sinh hoạt chung",
];

const reviews = [
  {
    name: "Anh T. – TP.HCM",
    tag: "Gia đình 4 người",
    content:
      "Căn hộ rất sạch và thơm, ban công nhìn biển sáng sớm đẹp mê ly. Host hỗ trợ nhận phòng tự động cực nhanh.",
  },
  {
    name: "Chị L. – Đồng Nai",
    tag: "Đặt qua Zalo",
    content:
      "Lần đầu ở The Sóng mà cảm giác thân thiện như ở nhà. Bé con mê khu vui chơi, còn mình thì thích khu sauna.",
  },
  {
    name: "Anh H. – Bình Dương",
    tag: "Team 6 người",
    content:
      "Layout căn hộ hợp lý, có đủ bếp và dụng cụ nấu BBQ. Bạn host tư vấn rất kỹ về lịch trình ăn uống.",
  },
];

const exploreSpots = [
  {
    title: "Mũi Nghinh Phong",
    desc: "Đón bình minh, chụp ảnh cổng trời, nên đi buổi sáng sớm.",
    image: "/thesong/Tien-ich-The-Song-Vung-Tau3.jpeg",
  },
  {
    title: "Bãi Sau",
    desc: "Bãi biển đông vui, nhiều hàng quán hải sản địa phương, phù hợp nhóm trẻ.",
    image: "/thesong/Tien-ich-The-Song-Vung-Tau14.jpeg",
  },
  {
    title: "Chợ Xóm Lưới",
    desc: "Mua hải sản tươi lúc sáng sớm, nhờ chế biến tại chỗ hoặc đem về căn hộ.",
    image: "/thesong/Tien-ich-The-Song-Vung-Tau5.jpeg",
  },
];

const beachBackgroundStyle = {
  backgroundImage:
    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

const WaveDivider = () => (
  <>
    <div className="wave-divider mx-auto w-full max-w-6xl drop-shadow-[0_12px_28px_rgba(0,85,164,0.15)]" aria-hidden="true">
      <svg viewBox="0 0 1440 140" className="h-16 w-full transition-transform duration-1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d7f0ff" />
            <stop offset="50%" stopColor="#c0e6ff" />
            <stop offset="100%" stopColor="#ffe7c4" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C160,120 320,-5 520,50 C720,105 880,10 1080,60 C1240,100 1360,80 1440,70 L1440,140 L0,140 Z"
          fill="url(#waveGradient)"
          opacity="0.8"
          className="wave-primary"
        />
        <path
          d="M0,85 C120,140 300,20 520,85 C740,150 1000,20 1220,85 C1360,120 1440,110 1440,110 L1440,140 L0,140 Z"
          fill="#ffffff"
          opacity="0.55"
          className="wave-secondary"
        />
      </svg>
    </div>
  </>
);

export default function Home() {
  return (
    <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section
          className="grid gap-10 rounded-[48px] bg-white/75 p-6 shadow-2xl shadow-sky-100/70 ring-1 ring-white/50 lg:grid-cols-[1.1fr_0.9fr]"
          id="hero"
        >
          <article className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF2D6] px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#c78b37]">
              🌞 Summer
              <span className="tracking-normal text-[#0055A4]">Staycation</span>
            </div>
            <div className="rounded-[32px] bg-gradient-to-r from-[#e0f3ff] to-transparent p-1">
              <div className="rounded-[28px] bg-white/80 px-6 py-4">
                <p className="text-sm uppercase tracking-[0.4em] text-[#0055A4]">Châu Homestay</p>
                <h1 className="text-[1.4rem] font-semibold leading-snug text-slate-900 sm:text-[1.9rem]">
                  Căn hộ nghỉ dưỡng tại
                  <br />
                  The Sóng Vũng Tàu
                </h1>
              </div>
            </div>
            <p className="text-lg text-slate-600">
              Châu Homestay mang đến không gian căn hộ hiện đại, đầy đủ tiện nghi, vài bước ra biển,
              phù hợp gia đình và nhóm bạn tìm kiếm kỳ nghỉ ấm cúng.
            </p>
            <ul className="space-y-4">
              {heroHighlights.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F4FF] text-[#0055A4] shadow-inner">
                    ✓
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/can-ho-the-song"
                className="rounded-full bg-[#0055A4] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#0055a420] transition hover:-translate-y-0.5 hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
              >
                Xem các căn hộ
              </Link>
              <Link
                href="https://zalo.me"
                className="rounded-full border border-[#0055A4] px-6 py-3 text-center text-sm font-semibold text-[#0055A4] transition hover:-translate-y-0.5 hover:bg-[#0055A4] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
              >
                Tư vấn qua Zalo
              </Link>
            </div>
          </article>
          <div className="grid gap-4 rounded-3xl bg-white/60 p-4 shadow-xl shadow-slate-200/70 sm:grid-cols-2">
            <div className="col-span-2 overflow-hidden rounded-[30px]">
              <div className="relative h-72 w-full overflow-hidden rounded-[30px]">
                <Image
                  src="/apartment/president/z7238038173562_f901c91e2457a32e242b7ed98c2e486d.jpg"
                  alt="Phòng ngủ sáng tràn ánh sáng"
                  fill
                  sizes="(min-width:1024px) 540px, 100vw"
                  className="object-cover transition hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-slate-900 shadow">
                  Căn hộ signature
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-[26px]">
              <div className="relative h-48 w-full">
                <Image
                  src="/apartment/Havila-Luxury/Havila-Luxury-15.jpg"
                  alt="Không gian bếp ấm cúng"
                  fill
                  sizes="(min-width:640px) 260px, 100vw"
                  className="object-cover transition hover:scale-105"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-[26px]">
              <div className="relative h-48 w-full">
                <Image
                  src="/apartment/Luxury/z7237609503012_b673252d3dd5eea2f29e7a8465fa3952.jpg"
                  alt="Gian bếp rộng mở"
                  fill
                  sizes="(min-width:640px) 260px, 100vw"
                  className="object-cover transition hover:scale-105"
                />
              </div>
            </div>
            <div className="col-span-2 overflow-hidden rounded-[26px]">
              <div className="relative h-48 w-full">
                <Image
                  src="/apartment/suite/z7238034694549_2dc9301a265e41b47f28036912bcd439.jpg"
                  alt="Góc bếp rộng rãi tại căn hộ suite"
                  fill
                  sizes="(min-width:1024px) 540px, 100vw"
                  className="object-cover transition hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        <section id="benefits" className="space-y-8 rounded-[40px] bg-white/70 p-8 shadow-xl shadow-sky-100/60">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Lợi ích</p>
            <h2 className="text-3xl font-semibold text-slate-900">Lợi ích khi ở Châu Homestay</h2>
            <p className="text-base text-slate-600">
              Mỗi chi tiết được chăm chút để kỳ nghỉ của bạn trở nên trọn vẹn nhất.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{benefit.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <WaveDivider />

        <section id="apartments" className="space-y-8">
          <div className="flex flex-col gap-3 text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Căn hộ nổi bật</p>
            <h2 className="text-3xl font-semibold text-slate-900">Chọn căn phù hợp với bạn</h2>
            <p className="text-base text-slate-600">
              Bộ sưu tập căn hộ đẹp nhất tại The Sóng cho mọi nhu cầu nghỉ dưỡng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredApartments.map((apt) => (
              <article
                key={apt.name}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden rounded-3xl rounded-b-none">
                  <Image
                    src={apt.image}
                    alt={apt.name}
                    fill
                    sizes="(min-width:1024px) 360px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                    {apt.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{apt.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{apt.specs}</p>
                  </div>
                  <p className="text-sm text-slate-600">{apt.desc}</p>
                  <div className="mt-auto space-y-3">
                    <p className="text-lg font-semibold text-[#b88b5a]">{apt.price}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="#cta"
                        className="flex-1 rounded-full bg-[#0055A4] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
                      >
                        Đặt qua Zalo
                      </Link>
                      <Link
                        href="#cta"
                        className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <WaveDivider />

        <section
          id="amenities"
          className="relative grid gap-10 overflow-hidden rounded-[40px] bg-white/80 p-8 shadow-xl shadow-slate-200/50 md:grid-cols-2"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#FFF2D6] opacity-50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-[#b3e5ff] opacity-50 blur-2xl" />
          <article className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Tiện ích</p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Tiện ích The Sóng Vũng Tàu – chuẩn resort
            </h2>
            <p className="text-base text-slate-600">
              Tận hưởng hệ thống tiện ích cao cấp dành riêng cho cư dân và khách lưu trú, giúp bạn
              thư giãn trọn vẹn cả ngày.
            </p>
            <ul className="space-y-3">
              {amenityList.map((amenity) => (
                <li key={amenity} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-[#0055A4]">
                  ✓
                  </span>
                  <span>{amenity}</span>
            </li>
              ))}
          </ul>
        </article>
          <div className="relative overflow-hidden rounded-[34px]">
            <div className="relative h-full min-h-[320px] w-full">
              <Image
                src="/thesong/Tien-ich-The-Song-Vung-Tau6.jpeg"
                alt="Tiện ích The Sóng Vũng Tàu"
                fill
                sizes="(min-width:1024px) 540px, 100vw"
                className="object-cover transition hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/85 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg">
              Thẻ cư dân giúp bạn dùng trọn tiện ích như hồ bơi tràn, jacuzzi, sky bar.
            </div>
          </div>
        </section>

        <WaveDivider />

        <section
          className="relative overflow-hidden rounded-[40px] text-white"
          aria-label="Trải nghiệm thực tế"
        >
          <div
            className="bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "url('/thesong/Tien-ich-The-Song-Vung-Tau4.jpeg')" }}
          >
            <div className="bg-gradient-to-r from-[#023b77]/80 via-[#0055a4]/70 to-[#f7b267]/40 px-6 py-20 sm:px-8 lg:px-16">
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-white/80">Trải nghiệm</p>
                <h2 className="text-3xl font-semibold leading-tight">
                  Cảm nhận làn gió biển và không gian tiện ích The Sóng ngay từ khi lướt trang
                </h2>
                <p className="text-base text-white/80">
                  Hệ tiện ích được đầu tư đồng bộ tạo nên những khoảnh khắc thư giãn hiếm có giữa
                  lòng thành phố biển. Scroll nhẹ để cảm nhận hiệu ứng parallax mô phỏng trải nghiệm
                  thực tế khi dạo bước trong khuôn viên.
                </p>
                <Link
                  href="#cta"
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Xem video tour 3 phút
                  <span aria-hidden>➜</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        <section id="reviews" className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá</p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Khách nói gì về Châu Homestay?
            </h2>
            <p className="text-base text-slate-600">Những trải nghiệm chân thật từ khách lưu trú.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                    <span className="text-xs text-slate-500">{review.tag}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[#f4b400]">★★★★★</div>
                <p className="mt-3 italic text-sm text-slate-700">&ldquo;{review.content}&rdquo;</p>
              </article>
            ))}
          </div>
        </section>

        <WaveDivider />

        <section
          id="explore"
          className="space-y-8 rounded-[40px] bg-gradient-to-b from-white/90 to-[#fff4e3]/80 p-8 shadow-xl shadow-slate-200/60"
        >
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Khám phá</p>
            <h2 className="text-3xl font-semibold text-slate-900">Khám phá Vũng Tàu</h2>
            <p className="text-base text-slate-600">
              Gợi ý trải nghiệm gần Châu Homestay để bạn lên lịch trình nhẹ nhàng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {exploreSpots.map((spot) => (
              <article
                key={spot.title}
                className="rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="h-48 overflow-hidden rounded-3xl rounded-b-none">
                  <div className="relative h-full w-full">
                    <Image
                      src={spot.image}
                      alt={spot.title}
                      fill
                      sizes="(min-width:1024px) 360px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-[#c78b37]">
                    <span aria-hidden>🏖️</span>
                    <h3 className="text-xl font-semibold text-slate-900">{spot.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{spot.desc}</p>
            <Link
                    href="#cta"
                    className="text-sm font-semibold text-[#0055A4] underline-offset-4 transition hover:underline"
                  >
                    Xem gợi ý lịch trình
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="rounded-[40px] bg-gradient-to-r from-[#0055A4] via-[#1a7fff] to-[#f4c481] p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">
                Bạn cần tư vấn chọn căn phù hợp cho nhóm và ngân sách?
              </h2>
              <p className="text-base text-white/80">
                Châu Homestay sẵn sàng gợi ý căn phù hợp, báo giá chi tiết và hỗ trợ đặt phòng nhanh
                qua Zalo.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="https://zalo.me"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[#0055A4] shadow-lg shadow-white/30 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Chat Zalo ngay
              </Link>
              <Link
                href="tel:+84909000000"
                className="rounded-full border border-white/60 px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Gọi cho chúng tôi
            </Link>
          </div>
        </div>
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}
