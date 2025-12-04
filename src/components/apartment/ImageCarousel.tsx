"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
    images: string[];
    productName: string;
}

export const ImageCarousel = ({ images, productName }: ImageCarouselProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: false });
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
        if (!emblaMainApi) return;
        emblaMainApi.on("select", onSelect).on("reInit", onSelect);

        // Initialize selected index after mount
        const initializeIndex = () => {
            const currentIndex = emblaMainApi.selectedScrollSnap();
            setSelectedIndex(currentIndex);
            if (emblaThumbsApi) {
                emblaThumbsApi.scrollTo(currentIndex);
            }
        };

        // Use setTimeout to avoid calling setState synchronously in effect
        const timeoutId = setTimeout(initializeIndex, 0);

        return () => {
            clearTimeout(timeoutId);
            emblaMainApi.off("select", onSelect).off("reInit", onSelect);
        };
    }, [emblaMainApi, emblaThumbsApi, onSelect]);

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Main Carousel */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-100 shadow-xl" ref={emblaMainRef}>
                <div className="flex">
                    {images.map((image, index) => (
                        <div key={index} className="relative min-w-0 flex-[0_0_100%]">
                            <Image
                                src={image}
                                alt={`${productName} - Ảnh ${index + 1}`}
                                width={1600}
                                height={900}
                                sizes="(min-width: 1024px) 66vw, 100vw"
                                className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[600px]"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 ? (
                <div className="overflow-hidden" ref={emblaThumbsRef}>
                    <div className="flex gap-3 py-1">
                        {images.map((image, index) => (
                            <Button
                                key={index}
                                type="button"
                                onClick={() => onThumbClick(index)}
                                variant="ghost"
                                className={`relative h-20 min-w-0 flex-[0_0_18%] rounded-2xl border border-transparent p-0 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-[#80b9ff] ${index === selectedIndex
                                    ? "border-[#b88b5a] bg-white shadow-md"
                                    : "bg-white/60 opacity-70 hover:opacity-100 hover:shadow-md"
                                    }`}
                                aria-label={`Xem ảnh ${index + 1}`}
                            >
                                <div
                                    className="relative h-full w-full overflow-hidden rounded-2xl"
                                >
                                    <Image
                                        src={image}
                                        alt={`${productName} - Thumbnail ${index + 1}`}
                                        width={300}
                                        height={300}
                                        sizes="(min-width: 1024px) 20vw, 20vw"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

