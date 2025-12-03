"use client";

import useEmblaCarousel from "embla-carousel-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCallback } from "react";

import { ApartmentCard } from "@/components/apartment/ApartmentCard";
import { Button } from "@/components/ui/button";
import type { ZaloProduct, ZaloProductMeta } from "@/lib/types/zalo";

interface FeaturedApartmentsCarouselProps {
  initialApartments: ZaloProduct[];
  initialMeta: ZaloProductMeta;
}

const EMBLA_OPTIONS = { align: "start", dragFree: true } as const;

export const FeaturedApartmentsCarousel = ({
  initialApartments,
  initialMeta,
}: FeaturedApartmentsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS);

  const totalApartments = initialMeta?.total ?? initialApartments.length;

  const handleScrollPrev = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleScrollNext = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    emblaApi.scrollNext();
  }, [emblaApi]);


  return (
    <div className="relative">
      <Button
        type="button"
        onClick={handleScrollPrev}
        variant="outline"
        size="icon"
        className="absolute -left-6 top-28 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 text-[#0f172a] transition-all duration-150 hover:border-[#0055A4]/40 hover:bg-white hover:shadow-md active:scale-90 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055A4]/50 focus-visible:ring-offset-2 sm:inline-flex sm:h-10 sm:w-10"
        aria-label="Xem căn hộ trước"
        tabIndex={0}
      >
        <FiChevronLeft className="h-5 w-5 transition-transform duration-150 active:scale-110" />
      </Button>
      <Button
        type="button"
        onClick={handleScrollNext}
        variant="outline"
        size="icon"
        className="absolute -right-6 top-28 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/95 text-[#0f172a] transition-all duration-150 hover:border-[#0055A4]/40 hover:bg-white hover:shadow-md active:scale-90 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055A4]/50 focus-visible:ring-offset-2 sm:inline-flex sm:h-10 sm:w-10"
        aria-label="Xem căn hộ tiếp theo"
        tabIndex={0}
      >
        <FiChevronRight className="h-5 w-5 transition-transform duration-150 active:scale-110" />
      </Button>
      <div
        ref={emblaRef}
        className="w-full overflow-hidden"
        role="region"
        aria-label={`Danh sách ${totalApartments} căn hộ nổi bật`}
        aria-roledescription="carousel"
        tabIndex={0}
      >
        <div className="flex touch-pan-y gap-6 pb-2 pl-0 pr-4 pt-2">
          {initialApartments.map((product) => (
            <div
              key={product._id}
              className="flex-[0_0_82%] flex-shrink-0 sm:flex-[0_0_50%] lg:flex-[0_0_30%]"
            >
              <ApartmentCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


