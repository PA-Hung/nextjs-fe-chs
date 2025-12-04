"use client";

import { useEffect, useState } from "react";
import { ReactGoogleReviews } from "react-google-reviews";
import type { ReactGoogleReview } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

import { appConfig } from "@/lib/config";

interface GoogleReviewsSectionProps {
    layout?: "badge" | "carousel" | "custom";
    className?: string;
    widgetId?: string; // Cho phép truyền widgetId tùy chỉnh
    locationName?: string; // Tên địa điểm để hiển thị
    showTitle?: boolean; // Hiển thị title section (mặc định true)
}

interface FeaturableReview {
    id: string;
    author: {
        name: string;
        avatarUrl: string | null;
    };
    text: string;
    rating: {
        value: number;
        max: number;
    };
    publishedAt: string;
}

interface FeaturableWidgetResponse {
    success: boolean;
    widget: {
        reviews: FeaturableReview[];
        gbpLocationSummary: {
            reviewsCount: number;
            rating: number;
            writeAReviewUri?: string;
        };
    };
}

const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    return "Poor";
};

const convertToReactGoogleReview = (review: FeaturableReview): ReactGoogleReview => {
    return {
        reviewId: review.id,
        reviewer: {
            displayName: review.author.name,
            profilePhotoUrl: review.author.avatarUrl || "",
            isAnonymous: false,
        },
        comment: review.text,
        starRating: review.rating.value,
        createTime: review.publishedAt,
        updateTime: null,
    };
};

export const GoogleReviewsSection = ({
    layout = "carousel",
    className,
    widgetId,
    locationName,
    showTitle = true
}: GoogleReviewsSectionProps) => {
    const [reviews, setReviews] = useState<ReactGoogleReview[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [totalReviewCount, setTotalReviewCount] = useState<number>(0);
    const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
    const [writeReviewUrl, setWriteReviewUrl] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sử dụng widgetId từ props hoặc từ config
    const activeWidgetId = widgetId || appConfig.featurableWidgetId;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const apiUrl = activeWidgetId
                    ? `/api/featurable-widget?widgetId=${encodeURIComponent(activeWidgetId)}`
                    : "/api/featurable-widget";
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const data: FeaturableWidgetResponse = await response.json();

                if (data.success && data.widget.reviews) {
                    const convertedReviews = data.widget.reviews.map(convertToReactGoogleReview);
                    setReviews(convertedReviews);
                    setAverageRating(data.widget.gbpLocationSummary.rating);
                    setTotalReviewCount(data.widget.gbpLocationSummary.reviewsCount);
                    // Lấy URL Google Business Profile và Write Review URL
                    if (data.widget.gbpLocationSummary.writeAReviewUri) {
                        const writeUrl = data.widget.gbpLocationSummary.writeAReviewUri;
                        setWriteReviewUrl(writeUrl);
                        // Lấy profile URL từ write review URL
                        const url = new URL(writeUrl);
                        const profileUrl = url.origin + url.pathname.replace(/\/write.*$/, "");
                        setProfileUrl(profileUrl);
                    }
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                console.error("Error fetching Featurable reviews:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (activeWidgetId) {
            fetchReviews();
        } else {
            setIsLoading(false);
        }
    }, [activeWidgetId]);

    if (!activeWidgetId) {
        return (
            <section id="google-reviews" className={`space-y-8 ${className ?? ""}`}>
                {showTitle && (
                    <div className="space-y-3 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá Google</p>
                        <h2 className="text-3xl font-semibold text-slate-900">Khách nói gì về Châu Homestay trên Google?</h2>
                        <p className="text-base text-slate-600">Những đánh giá chân thật từ khách hàng trên Google Business.</p>
                    </div>
                )}
                <div className="rounded-[40px] bg-white/90 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-white/60 lg:p-10">
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                            ⚙️ Đang cấu hình Google Reviews
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                            Vui lòng thêm NEXT_PUBLIC_FEATURABLE_WIDGET_ID vào file .env.local và restart dev server
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section id="google-reviews" className={`space-y-8 ${className ?? ""}`}>
                {showTitle && (
                    <div className="space-y-3 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá Google</p>
                        <h2 className="text-3xl font-semibold text-slate-900">Khách nói gì về Châu Homestay trên Google?</h2>
                        <p className="text-base text-slate-600">Những đánh giá chân thật từ khách hàng trên Google Business.</p>
                    </div>
                )}
                <div className="rounded-[40px] bg-white/90 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-white/60 lg:p-10">
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <p className="text-sm font-semibold text-slate-700">Đang tải đánh giá...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || reviews.length === 0) {
        return (
            <section id="google-reviews" className={`space-y-8 ${className ?? ""}`}>
                {showTitle && (
                    <div className="space-y-3 text-center">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá Google</p>
                        <h2 className="text-3xl font-semibold text-slate-900">Khách nói gì về Châu Homestay trên Google?</h2>
                        <p className="text-base text-slate-600">Những đánh giá chân thật từ khách hàng trên Google Business.</p>
                    </div>
                )}
                <div className="rounded-[40px] bg-white/90 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-white/60 lg:p-10">
                    <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-8 text-center">
                        <p className="text-sm font-semibold text-red-700">
                            ⚠️ Không thể tải đánh giá
                        </p>
                        <p className="mt-2 text-xs text-red-500">{error ?? "Không có dữ liệu"}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="google-reviews" className={`space-y-8 ${className ?? ""}`}>
            {showTitle && (
                <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#b88b5a]">Đánh giá Google</p>
                    <h2 className="text-3xl font-semibold text-slate-900">
                        {locationName ? `Khách nói gì về ${locationName} trên Google?` : "Khách nói gì về Châu Homestay trên Google?"}
                    </h2>
                    <p className="text-base text-slate-600">Những đánh giá chân thật từ khách hàng trên Google Business.</p>
                </div>
            )}

            {/* Review Badge Bar - Custom Long Bar */}
            <div className="w-full rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/80 ring-1 ring-white/60">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
                    {/* Left side: Rating info */}
                    <div className="flex flex-1 items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                {averageRating >= 4.5 && (
                                    <span className="text-lg font-bold text-slate-900">{getRatingLabel(averageRating)}</span>
                                )}
                                <span className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</span>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => {
                                        const filled = i < Math.floor(averageRating);
                                        const halfFilled = i === Math.floor(averageRating) && averageRating % 1 >= 0.5;
                                        return (
                                            <svg
                                                key={i}
                                                className={`h-6 w-6 ${filled ? "text-[#f4b400]" : halfFilled ? "text-[#f4b400]" : "text-slate-300"}`}
                                                fill={filled || halfFilled ? "currentColor" : "none"}
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                            >
                                                {halfFilled ? (
                                                    <defs>
                                                        <linearGradient id={`half-${i}`}>
                                                            <stop offset="50%" stopColor="currentColor" />
                                                            <stop offset="50%" stopColor="transparent" />
                                                        </linearGradient>
                                                    </defs>
                                                ) : null}
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                    fill={halfFilled ? `url(#half-${i})` : undefined}
                                                />
                                            </svg>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">Google Rating</span>
                            </div>
                            {profileUrl && (
                                <a
                                    href={profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#4285F4] hover:underline"
                                >
                                    Đọc {totalReviewCount} đánh giá
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right side: Write Review Button */}
                    {writeReviewUrl && (
                        <a
                            href={writeReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[#4285F4] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#357ae8] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2"
                        >
                            Viết đánh giá
                        </a>
                    )}
                </div>
            </div>

            {/* Reviews Carousel */}
            {layout === "carousel" && (
                <div className="rounded-[40px] bg-white/90 p-6 shadow-xl shadow-slate-200/80 ring-1 ring-white/60 lg:p-10">
                    <ReactGoogleReviews
                        layout="carousel"
                        reviews={reviews}
                        theme="light"
                        nameDisplay="firstAndLastInitials"
                        logoVariant="icon"
                        maxCharacters={200}
                        dateDisplay="relative"
                        reviewVariant="card"
                        structuredData={false}
                        brandName="Châu Homestay"
                        productName="Căn hộ The Sóng Vũng Tàu"
                        productDescription="Căn hộ nghỉ dưỡng hiện đại, đầy đủ tiện nghi tại The Sóng Vũng Tàu"
                        accessibility={true}
                        carouselSpeed={4000}
                        carouselAutoplay={true}
                        maxItems={3}
                        averageRating={averageRating}
                        totalReviewCount={totalReviewCount}
                    />
                </div>
            )}
        </section>
    );
};

