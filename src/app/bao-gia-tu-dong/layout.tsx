import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Báo giá tự động căn hộ The Sóng & Villa | Châu Homestay",
    description:
        "Tra cứu giá phòng căn hộ The Sóng và villa Châu Homestay Vũng Tàu theo ngày, tự động tính tổng tiền theo ngày thường, cuối tuần và lễ tết.",
    openGraph: {
        title: "Báo giá tự động căn hộ The Sóng & Villa | Châu Homestay",
        description:
            "Tra cứu giá phòng căn hộ The Sóng và villa Châu Homestay Vũng Tàu theo ngày, tự động tính tổng tiền theo ngày thường, cuối tuần và lễ tết.",
        url: "https://chauhomestay.com/bao-gia-tu-dong",
        type: "website",
    },
    alternates: {
        canonical: "/bao-gia-tu-dong",
    },
};

export default function BaoGiaTuDongLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
