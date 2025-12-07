import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import BookingForm from "@/components/dat-phong/BookingForm";

export const metadata: Metadata = {
  title: "Đặt phòng căn hộ The Sóng & villa Vũng Tàu | Châu Homestay",
  description:
    "Đặt phòng căn hộ The Sóng và villa Châu Homestay Vũng Tàu nhanh chóng, xác nhận trực tiếp, hỗ trợ đổi ngày, tư vấn lịch trình du lịch.",
  openGraph: {
    title: "Đặt phòng căn hộ The Sóng & villa Vũng Tàu | Châu Homestay",
    description:
      "Đặt phòng căn hộ The Sóng và villa Châu Homestay Vũng Tàu nhanh chóng, xác nhận trực tiếp, hỗ trợ đổi ngày, tư vấn lịch trình du lịch.",
    url: "https://chauhomestay.com/dat-phong",
    type: "website",
  },
  alternates: {
    canonical: "/dat-phong",
  },
};

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto flex max-w-4xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-6 lg:pb-16">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Đặt phòng" },
          ]}
        />

        <section className="rounded-[40px] bg-white/95 p-6 shadow-2xl shadow-slate-200/80 ring-1 ring-white/70 lg:p-10">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">
              @đặt-phòng
            </p>
            <h1 className="text-[2rem] font-semibold leading-snug text-slate-900 md:text-[2.4rem]">
              Đặt phòng Châu Homestay Vũng Tàu
            </h1>
            <p className="text-base text-slate-600">
              Điền thông tin bên dưới, đội ngũ Châu Homestay sẽ gọi điện hoặc
              nhắn Zalo để xác nhận chi tiết căn, báo giá và giữ chỗ nhanh
              nhất có thể.
            </p>
          </header>

          <BookingForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default BookingPage;


