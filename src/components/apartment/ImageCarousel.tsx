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
                            <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px]">
                                <Image
                                    src={image}
                                    alt={`${productName} - Ảnh ${index + 1}`}
                                    fill
                                    sizes="(min-width: 1024px) 66vw, 100vw"
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 ? (
                <div className="overflow-hidden" ref={emblaThumbsRef}>
                    <div className="flex gap-2">
                        {images.map((image, index) => (
                            <Button
                                key={index}
                                type="button"
                                onClick={() => onThumbClick(index)}
                                variant="ghost"
                                className={`relative min-w-0 flex-[0_0_20%] p-0 transition-all ${index === selectedIndex
                                    ? "p-1"
                                    : "opacity-60 hover:opacity-100"
                                    }`}
                                aria-label={`Xem ảnh ${index + 1}`}
                            >
                                <div
                                    className={`relative aspect-square overflow-hidden rounded-xl ${index === selectedIndex
                                        ? "ring-2 ring-[#b88b5a]"
                                        : ""
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${productName} - Thumbnail ${index + 1}`}
                                        fill
                                        sizes="(min-width: 1024px) 20vw, 20vw"
                                        className="object-cover"
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

