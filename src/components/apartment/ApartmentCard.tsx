import Image from "next/image";
import Link from "next/link";
import { FaRulerCombined, FaBed, FaBath, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

import type { ZaloProduct } from "@/lib/types/zalo";
import { createProductSlug } from "@/lib/utils/slug";

// const currencyFormatter = new Intl.NumberFormat("vi-VN", {
//   style: "currency",
//   currency: "VND",
//   maximumFractionDigits: 0,
// });

interface ApartmentCardProps {
  product: ZaloProduct;
}

const getViewBadgeColor = (view?: string) => {
  if (!view) return "bg-white/90 text-slate-900";
  const v = view.toLowerCase();
  if (v.includes("biển")) return "bg-blue-100 text-blue-700";
  if (v.includes("núi")) return "bg-green-100 text-green-700";
  if (v.includes("thành phố")) return "bg-yellow-100 text-yellow-700";
  return "bg-white/90 text-slate-900";
};

export const ApartmentCard = ({ product }: ApartmentCardProps) => {

  // Ưu tiên dùng slug từ API, fallback về generate từ name nếu chưa có
  const productSlug = product.slug || createProductSlug(product.name);

  return (
    <article className="flex h-full flex-col rounded-[32px] border border-slate-100 bg-white transition hover:border-[#0055A4]">
      <div className="relative h-56 overflow-hidden rounded-[32px] rounded-b-none">
        <Image
          src={product.coverImageUrl || product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 360px, 100vw"
          className="object-cover"
          priority={false}
        />
        {product.view && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${getViewBadgeColor(
              product.view
            )}`}
          >
            {product.view}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-3">
          <Link href={`/can-ho-the-song/${productSlug}`}>
            <h3 className="mb-3 min-h-[60px] text-base font-semibold leading-tight text-slate-900 transition hover:text-[#b88b5a] line-clamp-3">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <FaRulerCombined className="h-4 w-4 text-slate-400" />
              <span>{product.area}m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaBed className="h-4 w-4 text-slate-400" />
              <span>{product.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaBath className="h-4 w-4 text-slate-400" />
              <span>{product.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaUsers className="h-4 w-4 text-slate-400" />
              <span>Tối đa {product.maxGuests}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-1.5 text-sm leading-relaxed text-slate-600">
          <FaMapMarkerAlt className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="line-clamp-1">{product.location}</p>
        </div>
        <div className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dat-phong"
              className="flex w-full items-center justify-center rounded-full bg-[#0055A4] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff] sm:flex-1"
            >
              Đặt ngay
            </Link>
            <Link
              href={`/can-ho-the-song/${productSlug}`}
              className="flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 sm:flex-1"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

