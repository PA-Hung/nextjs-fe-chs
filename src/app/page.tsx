import Image from "next/image";
import Link from "next/link";

import { AmenitiesSection } from "@/components/common/AmenitiesSection";
import { ReviewsSection } from "@/components/common/ReviewsSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BlogTeaserSection } from "@/components/home/BlogTeaserSection";
import { FeaturedApartmentsSection } from "@/components/home/FeaturedApartmentsSection";
import { getBlogTravelPosts } from "@/lib/api/blog-list";
import { getZaloProducts } from "@/lib/api/zalo";
import type { BlogTravelPost } from "@/lib/types/blog";
import type { ZaloProduct, ZaloProductMeta } from "@/lib/types/zalo";

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
    icon: "🏊",
  },
  {
    title: "Decor ấm cúng",
    desc: "Căn hộ Japandi phối gỗ và màu beige tạo cảm giác thư thái.",
    icon: "🏡",
  },
  {
    title: "Hỗ trợ nhanh",
    desc: "Nhắn Zalo là có ngay gợi ý căn phù hợp nhu cầu và ngân sách.",
    icon: "⚡",
  },
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
  {
    name: "Chị M. – Hà Nội",
    tag: "Gia đình 5 người",
    content:
      "View biển từ ban công quá đẹp, sáng sớm ngắm bình minh không thể nào quên. Căn hộ decor rất tinh tế, đầy đủ tiện nghi.",
  },
  {
    name: "Anh K. – Đà Nẵng",
    tag: "Nhóm bạn 8 người",
    content:
      "Hồ bơi vô cực trên tầng 36 view cực đẹp, chụp ảnh sống ảo không cần chỉnh. Khu BBQ trên rooftop rất tiện cho party cuối tuần.",
  },
  {
    name: "Chị N. – Cần Thơ",
    tag: "Gia đình 3 người",
    content:
      "Bé nhà mình mê khu vui chơi trẻ em, còn mình thì thích phòng gym và sauna. Vị trí gần biển, đi bộ vài phút là tới.",
  },
  {
    name: "Anh P. – TP.HCM",
    tag: "Cặp đôi",
    content:
      "Không gian rất lãng mạn, ban công view biển hoàng hôn đẹp xuất sắc. Host nhiệt tình, tư vấn các địa điểm ăn uống rất hay.",
  },
  {
    name: "Chị Q. – Bình Phước",
    tag: "Gia đình 6 người",
    content:
      "Căn hộ rộng rãi, đủ chỗ cho cả gia đình. Bếp đầy đủ dụng cụ, nấu ăn rất tiện. Khu vực an ninh tốt, yên tâm để trẻ con chơi.",
  },
  {
    name: "Anh R. – Long An",
    tag: "Team building 10 người",
    content:
      "Phòng tiệc trên tầng thượng rất rộng, tổ chức team building hoàn hảo. Hồ bơi và sky bar view đẹp, mọi người đều thích.",
  },
  {
    name: "Chị S. – An Giang",
    tag: "Gia đình 4 người",
    content:
      "Lần đầu đến Vũng Tàu, chọn Châu Homestay là đúng đắn. Căn hộ sạch sẽ, view đẹp, tiện ích đầy đủ. Sẽ quay lại lần sau.",
  },
  {
    name: "Anh V. – TP.HCM",
    tag: "Nhóm bạn 7 người",
    content:
      "Giá cả hợp lý so với chất lượng. Hồ bơi vô cực và khu BBQ là điểm cộng lớn. Host phản hồi nhanh, hỗ trợ tận tình.",
  },
  {
    name: "Chị Y. – Đồng Tháp",
    tag: "Gia đình 5 người",
    content:
      "Decor căn hộ theo phong cách Japandi rất đẹp, không gian ấm cúng. Bé con thích khu vui chơi, người lớn thích phòng gym và sauna.",
  },
];

const beachBackgroundStyle = {
  backgroundImage:
    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 40%), linear-gradient(180deg, #CCE9FF 0%, #E1F2FF 45%, #FFF7EA 100%)",
};

const WaveDivider = () => (
  <>
    <div
      className="wave-divider relative left-1/2 w-screen -translate-x-1/2 drop-shadow-[0_12px_28px_rgba(0,85,164,0.15)]"
      aria-hidden="true"
    >
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

export default async function Home() {
  let featuredApartments: ZaloProduct[] = [];
  let featuredMeta: ZaloProductMeta = {
    current: 1,
    pageSize: 5,
    pages: 1,
    total: 0,
  };

  let blogPosts: BlogTravelPost[] = [];

  try {
    // Fetch tất cả sản phẩm một lần để tránh giật hình khi scroll
    const productsData = await getZaloProducts({ current: 1, pageSize: 100 });
    featuredApartments = productsData.result;
    featuredMeta = productsData.meta;
  } catch {
    // Nếu không fetch được dữ liệu, section sẽ hiển thị rỗng hoặc có thể thêm fallback
  }

  try {
    const blogData = await getBlogTravelPosts({ current: 1, pageSize: 6 });
    blogPosts = blogData.result;
  } catch {
    // Nếu lỗi, section blog sẽ ẩn
  }

  const heroBlogPosts = blogPosts.slice(0, 3);

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
              <div className="relative h-80 w-full overflow-hidden rounded-[30px]">
                <Image
                  src="/apartment/cover1.jpg"
                  alt="Căn hộ The Sóng Vũng Tàu"
                  fill
                  sizes="(min-width:1024px) 540px, 100vw"
                  className="object-cover object-center transition hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-slate-900 shadow">
                  Căn hộ signature
                </div>
              </div>
            </div>
            <div className="col-span-2 overflow-hidden rounded-[26px]">
              <div className="relative h-56 w-full overflow-hidden rounded-[26px]">
                <Image
                  src="/apartment/TSC-President-5.jpg"
                  alt="Không gian sống tiện nghi"
                  fill
                  sizes="(min-width:1024px) 540px, 100vw"
                  className="object-cover object-center transition hover:scale-105"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-[26px]">
              <div className="relative h-52 w-full overflow-hidden rounded-[26px]">
                <Image
                  src="/apartment/cover5.jpg"
                  alt="Phòng ngủ sang trọng"
                  fill
                  sizes="(min-width:640px) 260px, 100vw"
                  className="object-cover object-center transition hover:scale-105"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-[26px]">
              <div className="relative h-52 w-full overflow-hidden rounded-[26px]">
                <Image
                  src="/apartment/cover6.jpg"
                  alt="Ban công view biển"
                  fill
                  sizes="(min-width:640px) 260px, 100vw"
                  className="object-cover object-center transition hover:scale-105"
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

        <FeaturedApartmentsSection initialApartments={featuredApartments} initialMeta={featuredMeta} />

        <WaveDivider />

        <AmenitiesSection />

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

        <ReviewsSection reviews={reviews} />

        <WaveDivider />

        <BlogTeaserSection posts={heroBlogPosts} />

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
                className="rounded-full bg-white px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-[#0055A4] shadow-lg shadow-white/30 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:px-5 sm:text-sm sm:tracking-[0.2em] whitespace-nowrap"
              >
                Chat Zalo ngay
              </Link>
              <Link
                href="tel:+84963686963"
                className="rounded-full border border-white/60 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:px-5 sm:text-sm sm:tracking-[0.2em] whitespace-nowrap"
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
