"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const amenityData = [
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau.jpeg",
        title: "Khu BBQ ngoài trời trên rooftop",
        description: "Dãy bàn dài, bếp nướng, bồn rửa, mái che kính, đèn vàng buổi chiều/tối rất chill – phù hợp làm tiệc nướng, tụ tập nhóm.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau9.jpeg",
        title: "Phòng Gym hiện đại view kính toàn cảnh",
        description: "Máy chạy bộ, dàn tạ, máy tập đa năng, bóng tập… không gian rộng, sàn gỗ, gương lớn.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau6.jpeg",
        title: "Phòng xông hơi Sauna",
        description: "Phòng gỗ ấm, ghế bậc, đèn đá muối, cửa kính nhìn ra ngoài – khu thư giãn sau khi bơi/gym.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau4.jpeg",
        title: "Khu hồ bơi vô cực trên tầng thượng",
        description: "Hồ bơi tràn bờ, ghế nằm tắm nắng, pergola trang trí có đèn, cây xanh hai bên – vibe resort.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau14.jpeg",
        title: "Hồ bơi vô cực view biển & thành phố Vũng Tàu",
        description: "Sky pool dài dọc theo lan can kính, nhìn toàn cảnh bãi biển & city, rất hợp chụp hình sống ảo.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau5.jpeg",
        title: "Sảnh Rooftop – khu chờ & lối vào tiện ích trên cao",
        description: "Khu ghế sofa trắng, tường ốp đá, bảng chỉ dẫn \"Sky Bar – Pool – Rest room – Sauna – Sundeck\".",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau13.jpeg",
        title: "Công viên nước / khu hồ bơi trẻ em ngoài trời",
        description: "Hồ uốn lượn, cầu trượt xanh – vàng – cam, nhiều cây dừa, đường dạo xung quanh như \"dòng sông lười\" mini.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau8.jpeg",
        title: "Phòng tiệc / phòng sinh hoạt chung / meeting room",
        description: "Bàn dài, ghế nhiều chỗ, sofa, đèn thả trang trí – dùng cho họp nhóm, sinh nhật, ăn uống gia đình.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau3.jpeg",
        title: "Khu vui chơi trẻ em trong nhà",
        description: "Cầu trượt, khối leo trèo, thảm màu sắc, nhà chơi mini… không gian rộng, an toàn cho bé.",
    },
    {
        image: "/thesong/Tien-ich-The-Song-Vung-Tau2.jpeg",
        title: "Khu co-working / lounge làm việc & tiếp khách",
        description: "Sofa, ghế bành, bàn trà, không gian kính sáng, ngồi làm việc laptop hoặc tiếp khách rất ổn.",
    },
];

export const AmenitiesSection = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
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
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect).on("reInit", onSelect);
        const initializeState = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
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
        <section
            id="amenities"
            className="relative grid gap-10 overflow-hidden rounded-[40px] bg-white/80 p-8 shadow-xl shadow-slate-200/50 md:grid-cols-[3fr_7fr]"
        >
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#FFF2D6] opacity-50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-[#b3e5ff] opacity-50 blur-2xl" />
            <article className="space-y-5">
                <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Tiện ích</p>
                <h2 className="text-3xl font-semibold text-slate-900">
                    Tiện ích The Sóng Vũng Tàu – chuẩn resort
                </h2>
                <p className="text-base text-slate-600">
                    Tận hưởng hệ thống tiện ích cao cấp dành riêng cho cư dân và khách lưu trú, giúp bạn
                    thư giãn trọn vẹn cả ngày.
                </p>
                <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                        {amenityData[selectedIndex].title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700">
                        {amenityData[selectedIndex].description}
                    </p>
                </div>
            </article>
            <div className="relative overflow-hidden rounded-[34px]">
                <div className="relative overflow-hidden rounded-[34px]" ref={emblaRef}>
                    <div className="flex">
                        {amenityData.map((amenity, index) => (
                            <div key={index} className="relative min-w-0 flex-[0_0_100%]">
                                <div className="relative h-full min-h-[480px] w-full">
                                    <Image
                                        src={amenity.image}
                                        alt={amenity.title}
                                        fill
                                        sizes="(min-width:1024px) 540px, 100vw"
                                        className="object-cover object-center"
                                        priority={index === 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Navigation Buttons */}
                <div className="absolute inset-y-0 left-0 z-20 flex items-center px-2">
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Ảnh trước"
                    >
                        <svg
                            className="h-6 w-6 text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 z-20 flex items-center px-2">
                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className="rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Ảnh sau"
                    >
                        <svg
                            className="h-6 w-6 text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {amenityData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`h-2 rounded-full transition-all ${index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                                }`}
                            aria-label={`Chuyển đến ${amenityData[index].title}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

