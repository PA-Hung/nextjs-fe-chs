"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { Button } from "@/components/ui/button";

export interface Review {
    name: string;
    tag: string;
    content: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect).on("reInit", onSelect);
        const initializeState = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        const timeoutId = setTimeout(initializeState, 0);
        return () => {
            clearTimeout(timeoutId);
            emblaApi.off("select", onSelect).off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section id="reviews" className="space-y-8">
            <div className="space-y-3 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá</p>
                <h2 className="text-3xl font-semibold text-slate-900">Khách nói gì về Châu Homestay?</h2>
                <p className="text-base text-slate-600">Những trải nghiệm chân thật từ khách lưu trú.</p>
            </div>
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6">
                        {reviews.map((review) => (
                            <article
                                key={review.name}
                                className="min-w-0 flex-[0_0_100%] rounded-3xl border border-slate-100 bg-white/90 p-6 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-100" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                                        <span className="text-xs text-slate-500">{review.tag}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-[#f4b400]">★★★★★</div>
                                <p className="mt-3 italic text-sm text-slate-700">&ldquo;{review.content}&rdquo;</p>
                            </article>
                        ))}
                    </div>
                </div>
                {/* Navigation Buttons */}
                <div className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2">
                    <Button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/90 p-2 shadow-lg transition-all duration-150 hover:bg-white active:scale-90 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Đánh giá trước"
                    >
                        <svg
                            className="h-6 w-6 text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Button>
                </div>
                <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4">
                    <Button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-white/90 p-2 shadow-lg transition-all duration-150 hover:bg-white active:scale-90 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Đánh giá sau"
                    >
                        <svg
                            className="h-6 w-6 text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </section>
    );
};

