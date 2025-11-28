import Image from "next/image";
import Link from "next/link";

import type { ZaloProduct } from "@/lib/types/zalo";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

interface ApartmentCardProps {
  product: ZaloProduct;
}

const getBadgeLabel = (product: ZaloProduct) => {
  if (product.area >= 90) {
    return "Căn góc";
  }

  if (product.area >= 60) {
    return "View biển";
  }

  return "Hot";
};

export const ApartmentCard = ({ product }: ApartmentCardProps) => {
  const badge = getBadgeLabel(product);

  return (
    <article className="flex h-full flex-col rounded-[32px] border border-slate-100 bg-white shadow-[0_25px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_35px_55px_rgba(15,23,42,0.15)]">
      <div className="relative h-56 overflow-hidden rounded-[32px] rounded-b-none">
        <Image
          src={product.coverImageUrl || product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 360px, 100vw"
          className="object-cover"
          priority={false}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-1">
          <Link href={`/can-ho-the-song/${product._id}`}>
            <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
          </Link>
          <p className="text-sm text-slate-500">
            {product.area}m² · {product.bedrooms} phòng ngủ · {product.bathrooms} phòng tắm · Tối đa {product.maxGuests} khách
          </p>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{product.location}</p>
        <div className="space-y-2">
          <p className="text-base font-semibold text-[#b88b5a]">
            Từ {currencyFormatter.format(product.priceNormal)}/đêm
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://zalo.me"
              className="flex-1 rounded-full bg-[#0055A4] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
            >
              Đặt qua Zalo
            </Link>
            <Link
              href={`/can-ho-the-song/${product._id}`}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

