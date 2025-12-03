import type { Metadata } from "next";

import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { FilterSelect } from "@/components/common/FilterSelect";
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

type ProductTypeFilter = "căn hộ" | "villa";

interface ApartmentsPageProps {
  searchParams?: Promise<{
    current?: string;
    pageSize?: string;
    bedrooms?: string;
    productType?: string;
  }>;
}

const parseBedroomsFilter = (value?: string) => {
  if (!value || value === "all") {
    return undefined;
  }

  const allowed = new Set(["1", "2", "3"]);
  if (!allowed.has(value)) {
    return undefined;
  }

  return Number(value);
};

const parseProductTypeFilter = (value?: string): ProductTypeFilter | undefined => {
  if (!value || value === "all") {
    return undefined;
  }

  // Decode URL encoded value nếu cần
  const decodedValue = decodeURIComponent(value);

  // Backend expect "căn hộ" và "villa" (tiếng Việt)
  if (decodedValue === "căn hộ" || decodedValue === "villa") {
    return decodedValue;
  }

  // Fallback: kiểm tra giá trị gốc
  if (value === "căn hộ" || value === "villa") {
    return value;
  }

  return undefined;
};

export default async function ApartmentsPage({ searchParams }: ApartmentsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const current = Number(resolvedSearchParams?.current) > 0 ? Number(resolvedSearchParams?.current) : 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) > 0 ? Number(resolvedSearchParams?.pageSize) : 9;
  const bedroomsFilter = parseBedroomsFilter(resolvedSearchParams?.bedrooms);
  const productTypeFilter = parseProductTypeFilter(resolvedSearchParams?.productType);

  const bedroomOptions = [
    { label: "Tất cả phòng ngủ", value: "all" },
    { label: "1 phòng ngủ", value: "1" },
    { label: "2 phòng ngủ", value: "2" },
    { label: "3 phòng ngủ", value: "3" },
  ];

  const productTypeOptions = [
    { label: "Tất cả loại hình", value: "all" },
    { label: "Căn hộ", value: "căn hộ" },
    { label: "Villa", value: "villa" },
  ];

  let productsData: Awaited<ReturnType<typeof getZaloProducts>>;

  try {
    productsData = await getZaloProducts({
      current,
      pageSize,
      bedrooms: bedroomsFilter,
      productType: productTypeFilter,
    });
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

  const paginationQuery = {
    pageSize: String(pageSize),
    ...(bedroomsFilter ? { bedrooms: String(bedroomsFilter) } : {}),
    ...(productTypeFilter ? { productType: productTypeFilter } : {}),
  };

  return (
    <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-3 lg:pb-16">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Căn hộ The Sóng" },
          ]}
        />
        <section className="flex flex-col gap-10 rounded-[48px] bg-white/85 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-10">
          <header className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Căn hộ nổi bật</p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Chọn căn phù hợp với bạn</h1>
            <p className="text-base text-slate-600">
              Bộ sưu tập căn hộ đẹp nhất tại The Sóng, dữ liệu cập nhật trực tiếp từ hệ thống đặt phòng Châu Homestay.
            </p>
          </header>

          <div className="grid gap-4 rounded-[32px] bg-white/60 p-4 ring-1 ring-white/70 md:grid-cols-2">
            <FilterSelect
              id="productType"
              name="productType"
              defaultValue={productTypeFilter ?? "all"}
              options={productTypeOptions}
              label="Loại hình lưu trú"
              ariaLabel="Lọc theo loại hình lưu trú"
            />
            <FilterSelect
              id="bedrooms"
              name="bedrooms"
              defaultValue={bedroomsFilter ? String(bedroomsFilter) : "all"}
              options={bedroomOptions}
              label="Số phòng ngủ"
              ariaLabel="Lọc theo số phòng ngủ"
            />
          </div>

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
              <Pagination current={meta.current} totalPages={meta.pages} query={paginationQuery} />
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

