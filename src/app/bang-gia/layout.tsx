import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bảng giá căn hộ The Sóng & villa Châu Homestay Vũng Tàu",
    description:
        "Bảng giá căn hộ The Sóng và villa Châu Homestay Vũng Tàu, cập nhật liên tục, nhiều ưu đãi theo mùa, hỗ trợ tư vấn lựa chọn phòng phù hợp.",
    openGraph: {
        title: "Bảng giá căn hộ The Sóng & villa Châu Homestay Vũng Tàu",
        description:
            "Bảng giá căn hộ The Sóng và villa Châu Homestay Vũng Tàu, cập nhật liên tục, nhiều ưu đãi theo mùa, hỗ trợ tư vấn lựa chọn phòng phù hợp.",
        url: "https://chauhomestay.com/bang-gia",
        type: "website",
    },
    alternates: {
        canonical: "/bang-gia",
    },
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

