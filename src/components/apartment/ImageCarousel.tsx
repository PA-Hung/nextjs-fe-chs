"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

import { Button } from "@/components/ui/button";

interface ImageCarouselProps {
    images: string[];
    productName: string;
}

export const ImageCarousel = ({ images, productName }: ImageCarouselProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: false });
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });
    const [emblaLightboxRef, emblaLightboxApi] = useEmblaCarousel({ loop: true });

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

    // Lightbox handlers
    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    const goToPrevious = useCallback(() => {
        if (emblaLightboxApi) {
            emblaLightboxApi.scrollPrev();
        }
    }, [emblaLightboxApi]);

    const goToNext = useCallback(() => {
        if (emblaLightboxApi) {
            emblaLightboxApi.scrollNext();
        }
    }, [emblaLightboxApi]);

    // Sync lightbox carousel with lightboxIndex when opened
    useEffect(() => {
        if (isLightboxOpen && emblaLightboxApi) {
            emblaLightboxApi.scrollTo(lightboxIndex, true);
        }
    }, [isLightboxOpen, lightboxIndex, emblaLightboxApi]);

    // Update lightboxIndex when scrolling in lightbox
    useEffect(() => {
        if (!emblaLightboxApi) return;

        const onLightboxSelect = () => {
            setLightboxIndex(emblaLightboxApi.selectedScrollSnap());
        };

        emblaLightboxApi.on("select", onLightboxSelect);
        return () => {
            emblaLightboxApi.off("select", onLightboxSelect);
        };
    }, [emblaLightboxApi]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };

        // Prevent body scroll when lightbox is open
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext]);

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
        <>
            <div className="space-y-4">
                {/* Main Carousel */}
                <div className="relative overflow-hidden rounded-[32px] bg-slate-100 shadow-xl" ref={emblaMainRef}>
                    <div className="flex">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative min-w-0 flex-[0_0_100%] cursor-pointer"
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={image}
                                    alt={`${productName} - Ảnh ${index + 1}`}
                                    width={1600}
                                    height={900}
                                    sizes="(min-width: 1024px) 66vw, 100vw"
                                    className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[600px]"
                                    priority={index === 0}
                                />
                                {/* Zoom indicator */}
                                <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                                    Click để phóng to
                                </div>
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

            {/* Fullscreen Lightbox */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    style={{ width: '100vw', height: '100vh' }}
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 sm:p-3 text-white transition-colors hover:bg-white/20"
                        aria-label="Đóng"
                    >
                        <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white backdrop-blur-sm">
                        {lightboxIndex + 1} / {images.length}
                    </div>

                    {/* Previous button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 sm:p-3 text-white transition-colors hover:bg-white/20"
                            aria-label="Ảnh trước"
                        >
                            <FaChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    )}

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 sm:p-3 text-white transition-colors hover:bg-white/20"
                            aria-label="Ảnh sau"
                        >
                            <FaChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    )}

                    {/* Lightbox Carousel */}
                    <div className="h-full w-full px-8 py-6 sm:px-12 sm:py-8">
                        <div
                            className="h-full w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            ref={emblaLightboxRef}
                        >
                            <div className="flex h-full">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative min-w-0 flex-[0_0_100%] flex items-center justify-center"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${productName} - Ảnh ${index + 1}`}
                                            width={1920}
                                            height={1080}
                                            sizes="100vw"
                                            className="max-h-full max-w-full object-contain"
                                            priority={index === lightboxIndex}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Keyboard hint - hidden on mobile */}
                    <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
                        Phím ← → để chuyển ảnh • ESC để đóng
                    </div>
                </div>
            )}
        </>
    );
};
