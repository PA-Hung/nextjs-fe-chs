import type { Metadata } from "next";

import LoginForm from "@/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập khách hàng",
  description:
    "Đăng nhập Chau Homestay để xem thông tin đặt phòng, trạng thái thanh toán và hướng dẫn nhận phòng.",
  alternates: {
    canonical: "/login",
  },
};

const beachBackgroundStyle = {
  backgroundImage:
    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

const loginHighlights = [
  "Theo dõi mọi đơn đặt phòng và lịch lưu trú",
  "Nhận mã PIN thang máy, hướng dẫn check-in",
  "Chat concierge 24/7 để xử lý yêu cầu phát sinh",
];

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
      style={beachBackgroundStyle}
    >
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-[48px] bg-white/80 p-6 shadow-2xl shadow-sky-100/80 ring-1 ring-white/60 lg:flex-row lg:items-center lg:gap-12 lg:p-10">
        <div className="relative flex-1 lg:max-w-lg">
          <div className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full bg-[#bfe2ff] opacity-50 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#ffe2b6] opacity-60 blur-3xl" />
          <div className="relative rounded-[32px] bg-white/95 p-6 shadow-2xl shadow-slate-200/80 ring-1 ring-slate-100">
            <LoginForm />
            <p className="mt-4 text-center text-xs text-slate-500">
              Khách mới? Chat Zalo để được tạo tài khoản và nhận ưu đãi độc quyền.
            </p>
          </div>
        </div>

        <article className="flex-1 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF2D6] px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#c78b37]">
            🌞 Summer
            <span className="tracking-normal text-[#0055A4]">Staycation</span>
          </div>
          <div className="rounded-[28px] bg-white/80 px-6 py-4 shadow-inner shadow-slate-200/60">
            <p className="text-sm uppercase tracking-[0.4em] text-[#0055A4]">Châu Homestay</p>
            <h1 className="text-[1.8rem] font-semibold leading-snug text-slate-900 sm:text-[2.2rem]">
              Cổng khách lưu trú<br className="hidden sm:block" />
              Chau Homestay
            </h1>
          </div>
          <p className="text-base text-slate-600">
            Đăng nhập để xem lịch trình lưu trú, cập nhật ưu đãi theo thời gian thực và nhận hỗ trợ
            tức thì từ concierge The Sóng.
          </p>
          <ul className="space-y-4 text-left text-sm text-slate-700">
            {loginHighlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F4FF] text-[#0055A4] shadow-inner">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl bg-gradient-to-r from-[#0055A4] to-[#0b67c6] px-5 py-4 text-left text-white shadow-lg">
            <p className="text-sm font-semibold">Cần hỗ trợ khẩn?</p>
            <p className="text-xs text-white/80">
              Zalo: <span className="font-semibold text-white">0929 878 882</span> · Hotline:{" "}
              <span className="font-semibold text-white">0909 111 222</span>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

