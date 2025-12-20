import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    FaWifi,
    FaSnowflake,
    FaTv,
    FaUtensils,
    FaTshirt,
    FaBox,
    FaParking,
    FaSwimmingPool,
    FaDumbbell,
    FaUmbrellaBeach,
    FaHome,
    FaLock,
    FaArrowUp,
    FaThermometerHalf,
    FaCheck,
    FaRulerCombined,
    FaBed,
    FaBath,
    FaUsers,
    FaUserAlt,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

import { ImageCarousel } from "@/components/apartment/ImageCarousel";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getZaloProductBySlug } from "@/lib/api/zalo";
import { generateProductSchema } from "@/lib/seo/jsonld";

const beachBackgroundStyle = {
    backgroundImage:
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.4), transparent 40%), linear-gradient(180deg, #E8F6FF 0%, #F5FBFF 45%, #FFF7EA 100%)",
};

// const currencyFormatter = new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//     maximumFractionDigits: 0,
// });

const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    const iconClassName = "h-4 w-4 text-[#b88b5a]";

    // WiFi / Internet
    if (lowerAmenity.includes("wifi") || lowerAmenity.includes("internet") || lowerAmenity.includes("mạng")) {
        return <FaWifi className={iconClassName} />;
    }

    // Điều hòa / AC
    if (lowerAmenity.includes("điều hòa") || lowerAmenity.includes("máy lạnh") || lowerAmenity.includes("ac") || lowerAmenity.includes("air")) {
        return <FaSnowflake className={iconClassName} />;
    }

    // TV
    if (lowerAmenity.includes("tv") || lowerAmenity.includes("tivi") || lowerAmenity.includes("truyền hình")) {
        return <FaTv className={iconClassName} />;
    }

    // Bếp / Kitchen
    if (lowerAmenity.includes("bếp") || lowerAmenity.includes("kitchen") || lowerAmenity.includes("nấu ăn")) {
        return <FaUtensils className={iconClassName} />;
    }

    // Máy giặt / Washing machine
    if (lowerAmenity.includes("máy giặt") || lowerAmenity.includes("washing") || lowerAmenity.includes("giặt")) {
        return <FaTshirt className={iconClassName} />;
    }

    // Tủ lạnh / Refrigerator
    if (lowerAmenity.includes("tủ lạnh") || lowerAmenity.includes("refrigerator") || lowerAmenity.includes("fridge")) {
        return <FaBox className={iconClassName} />;
    }

    // Bãi đỗ xe / Parking
    if (lowerAmenity.includes("đỗ xe") || lowerAmenity.includes("parking") || lowerAmenity.includes("đậu xe") || lowerAmenity.includes("garage")) {
        return <FaParking className={iconClassName} />;
    }

    // Hồ bơi / Pool
    if (lowerAmenity.includes("hồ bơi") || lowerAmenity.includes("pool") || lowerAmenity.includes("bơi")) {
        return <FaSwimmingPool className={iconClassName} />;
    }

    // Gym / Fitness
    if (lowerAmenity.includes("gym") || lowerAmenity.includes("phòng tập") || lowerAmenity.includes("fitness")) {
        return <FaDumbbell className={iconClassName} />;
    }

    // View biển / Sea view
    if (lowerAmenity.includes("view biển") || lowerAmenity.includes("sea view") || lowerAmenity.includes("view") || lowerAmenity.includes("cảnh biển")) {
        return <FaUmbrellaBeach className={iconClassName} />;
    }

    // Ban công / Balcony
    if (lowerAmenity.includes("ban công") || lowerAmenity.includes("balcony") || lowerAmenity.includes("sân thượng")) {
        return <FaHome className={iconClassName} />;
    }

    // An ninh / Security
    if (lowerAmenity.includes("an ninh") || lowerAmenity.includes("security") || lowerAmenity.includes("bảo vệ")) {
        return <FaLock className={iconClassName} />;
    }

    // Thang máy / Elevator
    if (lowerAmenity.includes("thang máy") || lowerAmenity.includes("elevator") || lowerAmenity.includes("lift")) {
        return <FaArrowUp className={iconClassName} />;
    }

    // Nước nóng / Hot water
    if (lowerAmenity.includes("nước nóng") || lowerAmenity.includes("hot water") || lowerAmenity.includes("nóng lạnh")) {
        return <FaThermometerHalf className={iconClassName} />;
    }

    // Default checkmark icon
    return <FaCheck className={iconClassName} />;
};

interface ApartmentDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ApartmentDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const product = await getZaloProductBySlug(slug);

        return {
            title: product.name,
            description: `${product.name} - ${product.area}m², ${product.bedrooms} phòng ngủ, ${product.bathrooms} phòng tắm. Tối đa ${product.maxGuests} khách. ${product.location}.`,
            openGraph: {
                title: product.name,
                description: `${product.area}m² · ${product.bedrooms} phòng ngủ · ${product.bathrooms} phòng tắm · Tối đa ${product.maxGuests} khách`,
                images: [
                    {
                        url: product.coverImageUrl || product.images[0],
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
                type: "website",
            },
            alternates: {
                canonical: `/can-ho-the-song/${slug}`,
            },
        };
    } catch {
        return {
            title: "Không tìm thấy căn hộ",
            description: "Căn hộ bạn đang tìm không tồn tại hoặc đã bị xóa.",
        };
    }
}

export default async function ApartmentDetailPage({ params }: ApartmentDetailPageProps) {
    const { slug } = await params;

    let product;
    try {
        product = await getZaloProductBySlug(slug);
    } catch (error) {
        if (error instanceof Error && (error.message === "APARTMENT_NOT_FOUND" || error.message.includes("Không tìm thấy"))) {
            notFound();
        }

        return (
            <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
                <SiteHeader />
                <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
                    <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
                        <p className="text-lg font-semibold text-slate-900">Không thể tải thông tin căn hộ</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Vui lòng thử lại sau hoặc chat với Châu Homestay qua Zalo để được hỗ trợ nhanh.
                        </p>
                        <Link
                            href="/can-ho-the-song"
                            className="mt-6 inline-block rounded-full bg-[#0055A4] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
                        >
                            Quay lại danh sách
                        </Link>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    // Prepare images array - use coverImageUrl as first if available, then all other images
    const allImages = product.coverImageUrl
        ? [product.coverImageUrl, ...product.images.filter((img) => img !== product.coverImageUrl)]
        : product.images;

    return (
        <div className="min-h-screen text-slate-900" style={beachBackgroundStyle}>
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 pt-4 pb-12 sm:px-6 lg:px-8 lg:pt-3 lg:pb-16">
                <JsonLd
                    data={generateProductSchema({
                        name: product.name,
                        description:
                            product.description ||
                            `${product.area}m², ${product.bedrooms} phòng ngủ, ${product.bathrooms} phòng tắm, tối đa ${product.maxGuests} khách.`,
                        image: allImages,
                        url: `https://chauhomestay.com/can-ho-the-song/${slug}`,
                        price: product.priceNormal,
                        priceCurrency: "VND",
                        availability: "InStock",
                        brand: { name: "Châu Homestay" },
                        aggregateRating: {
                            ratingValue: 4.9,
                            reviewCount: 12,
                            bestRating: 5,
                            worstRating: 1,
                        },
                        review: [
                            {
                                author: { name: "Phan Anh Hùng" },
                                datePublished: "2024-10-15",
                                reviewBody: "Căn hộ rất đẹp, view biển tuyệt vời, tiện nghi đầy đủ. Chủ nhà nhiệt tình hỗ trợ.",
                                reviewRating: {
                                    ratingValue: 5,
                                    bestRating: 5,
                                    worstRating: 1,
                                },
                            },
                        ],
                        offers: {
                            price: product.priceNormal,
                            priceCurrency: "VND",
                            availability: "InStock",
                            url: `https://chauhomestay.com/can-ho-the-song/${slug}`,
                        },
                    })}
                />
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Căn hộ The Sóng", href: "/can-ho-the-song" },
                        { label: product.name },
                    ]}
                />
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    {/* Left Column - Images & Info */}
                    <div className="flex-1 space-y-8">
                        {/* Image Carousel with Thumbnails */}
                        <ImageCarousel images={allImages} productName={product.name} />

                        {/* Description Section */}
                        <section className="rounded-[32px] bg-white/85 p-6 shadow-xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-10">
                            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-slate-900">
                                Mô tả
                            </h2>
                            <div className="space-y-4 text-slate-700">
                                {/* <p className="text-base leading-relaxed">{product.location}</p> */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88b5a]/10">
                                            <FaRulerCombined className="h-5 w-5 text-[#b88b5a]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Diện tích</p>
                                            <p className="font-semibold text-slate-900">{product.area}m²</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88b5a]/10">
                                            <FaBed className="h-5 w-5 text-[#b88b5a]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Phòng ngủ</p>
                                            <p className="font-semibold text-slate-900">{product.bedrooms} phòng</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88b5a]/10">
                                            <FaBath className="h-5 w-5 text-[#b88b5a]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Phòng tắm</p>
                                            <p className="font-semibold text-slate-900">{product.bathrooms} phòng</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88b5a]/10">
                                            <FaUsers className="h-5 w-5 text-[#b88b5a]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Số khách tối đa</p>
                                            <p className="font-semibold text-slate-900">
                                                {product.maxGuests} khách{" "}
                                                {(product.adults || product.children) && (
                                                    <span className="font-normal text-slate-600 inline-flex items-center gap-1">
                                                        {" "}(
                                                        {product.adults ? (
                                                            <>
                                                                <span className="inline-flex items-center gap-0.5 sm:hidden">
                                                                    <FaUserAlt className="h-3 w-3" />
                                                                    {product.adults}
                                                                </span>
                                                                <span className="hidden sm:inline">người lớn {product.adults}</span>
                                                            </>
                                                        ) : null}
                                                        {product.adults && product.children ? " + " : ""}
                                                        {product.children ? (
                                                            <>
                                                                <span className="inline-flex items-center gap-0.5 sm:hidden">
                                                                    <MdChildCare className="h-3.5 w-3.5" />
                                                                    {product.children}
                                                                </span>
                                                                <span className="hidden sm:inline">trẻ em {product.children}</span>
                                                            </>
                                                        ) : null}
                                                        )
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


                        {/* Amenities Section */}
                        {product.amenities && product.amenities.length > 0 ? (
                            <section className="rounded-[32px] bg-white/85 p-6 shadow-xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-10">
                                <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-900">
                                    Tiện ích
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {product.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                {getAmenityIcon(amenity)}
                                            </div>
                                            <span className="text-sm text-slate-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {product.description && (
                            <section className="rounded-[32px] bg-white/85 p-6 shadow-xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-10">
                                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-slate-900">
                                    Thông tin chi tiết
                                </h2>
                                <div className="space-y-4 text-slate-700">
                                    <section
                                        className="ck-content prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#0055A4] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-img:rounded-2xl"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right Column - Booking Card */}
                    <aside className="lg:w-80">
                        <div className="sticky top-24 rounded-[32px] bg-white/85 p-6 shadow-2xl shadow-slate-200/70 ring-1 ring-white/60 lg:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="mb-2 text-2xl font-semibold text-slate-900">{product.name}</h1>
                                    <p className="mt-1 text-xs text-slate-500" hidden>id: {product._id}</p>
                                    <p className="text-sm text-slate-600">{product.location}</p>
                                </div>

                                <div className="space-y-3 border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Diện tích</span>
                                        <span className="font-semibold text-slate-900">{product.area}m²</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Phòng ngủ</span>
                                        <span className="font-semibold text-slate-900">{product.bedrooms}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Phòng tắm</span>
                                        <span className="font-semibold text-slate-900">{product.bathrooms}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Số khách</span>
                                        <span className="font-semibold text-slate-900">
                                            Tối đa {product.maxGuests}{" "}
                                            {(product.adults || product.children) && (
                                                <span className="font-normal text-slate-600 inline-flex items-center gap-1">
                                                    (
                                                    {product.adults ? (
                                                        <span className="inline-flex items-center gap-0.5">
                                                            <FaUserAlt className="h-3 w-3" />
                                                            {product.adults}
                                                        </span>
                                                    ) : null}
                                                    {product.adults && product.children ? " + " : ""}
                                                    {product.children ? (
                                                        <span className="inline-flex items-center gap-0.5">
                                                            <MdChildCare className="h-3.5 w-3.5" />
                                                            {product.children}
                                                        </span>
                                                    ) : null}
                                                    )
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    <Link
                                        href={`/dat-phong?product=${slug}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0055A4] px-6 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
                                    >
                                        Đặt ngay
                                    </Link>
                                    <Link
                                        href="/can-ho-the-song"
                                        className="flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-center text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                    >
                                        Xem thêm căn hộ khác
                                    </Link>
                                </div>

                                <div className="border-t border-slate-200 pt-4 text-center">
                                    <p className="text-xs text-slate-500">
                                        Cần hỗ trợ?{" "}
                                        <Link
                                            href="https://zalo.me/0963686963"
                                            className="font-semibold text-[#0055A4] transition hover:text-[#0b67c6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff]"
                                        >
                                            Chat ngay với chúng tôi
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

