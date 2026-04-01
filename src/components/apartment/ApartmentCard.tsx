import Image from "next/image";
import Link from "next/link";
import { FaRulerCombined, FaBed, FaBath, FaUsers, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

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

/**
 * Xác định base path dựa trên productType:
 * - "villa" → /villa
 * - mặc định → /can-ho-the-song
 */
const getProductBasePath = (productType?: string): string => {
  if (productType === "villa") return "/villa";
  return "/can-ho-the-song";
};

export const ApartmentCard = ({ product }: ApartmentCardProps) => {

  // Ưu tiên dùng slug từ API, fallback về generate từ name nếu chưa có
  const productSlug = product.slug || createProductSlug(product.name);
  const basePath = getProductBasePath(product.productType);
  const detailHref = `${basePath}/${productSlug}`;

  return (
    <article className="flex h-full flex-col rounded-[32px] border border-slate-100 bg-white transition hover:border-[#0055A4]">
      <Link href={detailHref} className="relative block h-56 overflow-hidden rounded-[32px] rounded-b-none">
        <Image
          src={product.coverImageUrl || product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 360px, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
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
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-3">
          <Link href={detailHref}>
            <h3 className="mb-3 min-h-[2.5rem] text-base font-semibold leading-tight text-slate-900 transition hover:text-[#b88b5a] line-clamp-2 overflow-hidden">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-purple-700 border border-purple-200">
              <FaRulerCombined className="h-3 w-3" />
              <span>{product.area}m²</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-pink-700 border border-pink-200">
              <FaBed className="h-3 w-3" />
              <span>{product.bedrooms}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-700 border border-cyan-200">
              <FaBath className="h-3 w-3" />
              <span>{product.bathrooms}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 border border-blue-200">
              <FaUsers className="h-3 w-3" />
              <span>Tối đa {product.maxGuests} khách</span>
            </span>
            {(product.adults || product.children) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 border border-amber-200">
                {product.adults ? (
                  <span className="inline-flex items-center gap-0.5">
                    <FaUserAlt className="h-2.5 w-2.5" />
                    {product.adults}
                  </span>
                ) : null}
                {product.adults && product.children ? <span>+</span> : null}
                {product.children ? (
                  <span className="inline-flex items-center gap-0.5">
                    <MdChildCare className="h-3 w-3" />
                    {product.children}
                  </span>
                ) : null}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-700 border border-red-200 max-w-full overflow-hidden">
            <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[200px]">{product.location}</span>
          </span>
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
              href={detailHref}
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

