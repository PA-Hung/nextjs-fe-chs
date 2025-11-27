import type { Metadata } from "next";

import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { Pagination } from "@/components/common/Pagination";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getZaloProducts } from "@/lib/api/zalo";

const beachBackgroundStyle = {
  backgroundImage:
    "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

export const metadata: Metadata = {
  title: "Danh sách căn hộ The Sóng Vũng Tàu",
  description:
    "Khám phá bộ sưu tập căn hộ và villa tại Châu Homestay – The Sóng Vũng Tàu. Dữ liệu cập nhật trực tiếp từ hệ thống đặt phòng.",
};

interface ApartmentsPageProps {
  searchParams?: Promise<{
    current?: string;
    pageSize?: string;
  }>;
}

export default async function ApartmentsPage({ searchParams }: ApartmentsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const current = Number(resolvedSearchParams?.current) > 0 ? Number(resolvedSearchParams?.current) : 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) > 0 ? Number(resolvedSearchParams?.pageSize) : 9;

  let productsData: Awaited<ReturnType<typeof getZaloProducts>>;

  try {
    productsData = await getZaloProducts({ current, pageSize });
  } catch {
    return (
      <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
        <SiteHeader />
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-lg font-semibold text-slate-900">Không thể tải danh sách căn hộ</p>
            <p className="mt-2 text-sm text-slate-500">
              Vui lòng thử lại sau hoặc chat với Châu Homestay qua Zalo để được hỗ trợ nhanh.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { result, meta } = productsData;

  return (
    <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-10 rounded-[48px] bg-white/85 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-10">
          <header className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Căn hộ nổi bật</p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Chọn căn phù hợp với bạn</h1>
            <p className="text-base text-slate-600">
              Bộ sưu tập căn hộ đẹp nhất tại The Sóng, dữ liệu cập nhật trực tiếp từ hệ thống đặt phòng Châu Homestay.
            </p>
          </header>

          {result.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
              <p className="text-lg font-semibold text-slate-900">Chưa có căn nào sẵn sàng</p>
              <p className="mt-2 text-sm text-slate-500">
                Vui lòng điều chỉnh bộ lọc hoặc chat với Châu Homestay qua Zalo để được tư vấn nhanh.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {result.map((product) => (
                  <ApartmentCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination current={meta.current} totalPages={meta.pages} />
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

