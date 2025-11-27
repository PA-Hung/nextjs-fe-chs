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

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:gap-16">
        <article className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.5em] text-amber-600">
            Chau Homestay
          </p>
          <h1 className="text-4xl font-bold text-zinc-900">
            Trung tâm đặt phòng của bạn
          </h1>
          <p className="text-lg text-zinc-600">
            Đăng nhập để xem lịch trình lưu trú, cập nhật ưu đãi theo thời gian thực
            và nhận hỗ trợ 24/7 từ concierge Chau Homestay.
          </p>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li>• Theo dõi trạng thái từng đơn đặt phòng The Sóng và villa.</li>
            <li>• Nhận mã PIN thang máy, hướng dẫn nhận phòng và dịch vụ bổ sung.</li>
            <li>• Cập nhật yêu cầu đặc biệt (set up sinh nhật, BBQ, picnic...).</li>
          </ul>
        </article>

        <div className="flex-1 lg:max-w-lg">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}

