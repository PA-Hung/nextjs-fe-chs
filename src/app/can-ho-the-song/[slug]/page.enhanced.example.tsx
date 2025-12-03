/**
 * VÍ DỤ NÂNG CAO: Trang chi tiết sản phẩm với đầy đủ SEO
 * So sánh với file page.tsx hiện tại để thêm JSON-LD
 */

import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateProductSchema, type ProductSchema } from "@/lib/seo/jsonld";
import { generateSeoMetadata } from "@/lib/seo/metadata";
// import { getZaloProductBySlug } from "@/lib/api/zalo";

interface ApartmentDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ApartmentDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        // const product = await getZaloProductBySlug(slug);
        const product = {
            name: "Căn hộ The Sóng 3PN View Biển",
            area: 120,
            bedrooms: 3,
            bathrooms: 2,
            maxGuests: 6,
            location: "The Sóng, Vũng Tàu",
            priceNormal: 2000000,
            coverImageUrl: "/apartment/cover1.jpg",
            images: ["/apartment/cover1.jpg"],
        };

        return generateSeoMetadata({
            title: product.name,
            description: `${product.name} - ${product.area}m², ${product.bedrooms} phòng ngủ, ${product.bathrooms} phòng tắm. Tối đa ${product.maxGuests} khách. ${product.location}. Giá từ ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.priceNormal)}/đêm.`,
            image: product.coverImageUrl,
            url: `/can-ho-the-song/${slug}`,
            type: "product",
            tags: ["căn hộ", "vũng tàu", "the sóng", "homestay"],
        });
    } catch {
        return {
            title: "Không tìm thấy căn hộ",
            description: "Căn hộ bạn đang tìm không tồn tại.",
        };
    }
}

export default async function ApartmentDetailPage({ params }: ApartmentDetailPageProps) {
    const { slug } = await params;

    // const product = await getZaloProductBySlug(slug);
    const product = {
        name: "Căn hộ The Sóng 3PN View Biển",
        area: 120,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        location: "The Sóng, Vũng Tàu",
        priceNormal: 2000000,
        coverImageUrl: "/apartment/cover1.jpg",
        images: ["/apartment/cover1.jpg"],
        description: "Căn hộ hiện đại với view biển tuyệt đẹp...",
    };

    // Tạo JSON-LD schema cho Product
    const productSchema: ProductSchema = {
        name: product.name,
        description: product.description,
        image: product.coverImageUrl ? [product.coverImageUrl, ...product.images] : product.images,
        price: product.priceNormal,
        priceCurrency: "VND",
        availability: "InStock",
        url: `https://chauhomestay.com/can-ho-the-song/${slug}`,
        brand: {
            name: "Châu Homestay",
            logo: "https://chauhomestay.com/logo.png",
        },
        offers: {
            price: product.priceNormal,
            priceCurrency: "VND",
            availability: "InStock",
            url: `https://chauhomestay.com/can-ho-the-song/${slug}`,
        },
    };

    return (
        <>
            <JsonLd data={generateProductSchema(productSchema)} />
            {/* Rest of your component JSX */}
            <div>
                <h1>{product.name}</h1>
                {/* ... */}
            </div>
        </>
    );
}

