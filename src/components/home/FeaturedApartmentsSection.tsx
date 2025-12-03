import Link from "next/link";

import { FeaturedApartmentsCarousel } from "@/components/home/FeaturedApartmentsCarousel";
import type { ZaloProduct, ZaloProductMeta } from "@/lib/types/zalo";

interface FeaturedApartmentsSectionProps {
    initialApartments: ZaloProduct[];
    initialMeta: ZaloProductMeta;
}

export const FeaturedApartmentsSection = ({
    initialApartments,
    initialMeta,
}: FeaturedApartmentsSectionProps) => {
    const hasFeaturedApartments = initialApartments.length > 0;

    return (
        <section id="apartments" className="space-y-8" aria-labelledby="featured-apartments-heading">
            <div className="flex flex-col gap-3 text-left">
                <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Căn hộ nổi bật</p>
                <h2 id="featured-apartments-heading" className="text-3xl font-semibold text-slate-900">
                    Chọn căn phù hợp với bạn
                </h2>
                <p className="text-base text-slate-600">
                    Bộ sưu tập căn hộ đẹp nhất tại The Sóng cho mọi nhu cầu nghỉ dưỡng.
                </p>
            </div>
            {!hasFeaturedApartments ? (
                <div
                    className="rounded-[32px] border border-dashed border-slate-200 bg-white/70 p-8 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-lg font-semibold text-slate-900">Đang tải danh sách căn hộ...</p>
                    <p className="mt-2 text-sm text-slate-500">
                        Vui lòng thử lại sau hoặc chat với Châu Homestay qua Zalo để được hỗ trợ nhanh.
                    </p>
                </div>
            ) : (
                <>
                    <FeaturedApartmentsCarousel initialApartments={initialApartments} initialMeta={initialMeta} />
                    <div className="flex justify-center pt-4">
                        <Link
                            href="/can-ho-the-song"
                            className="rounded-full border-2 border-[#0055A4] bg-white px-8 py-3 text-center text-sm font-semibold text-[#0055A4] transition hover:bg-[#0055A4] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
                        >
                            Xem thêm tất cả căn hộ
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
};

