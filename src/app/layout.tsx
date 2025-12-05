import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "ckeditor5/ckeditor5.css";
import "./globals.css";

import { AuthProvider } from "@/auth/context/AuthProvider";
import { getServerSession } from "@/auth/session";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateLodgingBusinessSchema, generateOrganizationSchema } from "@/lib/seo/jsonld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chauhomestay.com"),
  title: {
    default: "Châu Homestay | Căn hộ & Villa Vũng Tàu",
    template: "%s | Châu Homestay",
  },
  description:
    "Hệ thống đặt phòng chính thức cho căn hộ The Sóng và villa boutique của Châu Homestay tại Vũng Tàu.",
  openGraph: {
    title: "Châu Homestay | Căn hộ & Villa Vũng Tàu",
    description:
      "Đặt căn hộ The Sóng và villa Châu Homestay trực tuyến, cập nhật giá và tình trạng phòng theo thời gian thực.",
    url: "https://chauhomestay.com",
    siteName: "Châu Homestay",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessSchema = generateLodgingBusinessSchema({
  name: "Châu Homestay",
  description:
    "Hệ thống căn hộ The Sóng và villa boutique tại Vũng Tàu, hỗ trợ khách du lịch gia đình và nhóm bạn.",
  image: [
    "https://chauhomestay.com/logo.png",
    "https://chauhomestay.com/og-image.jpg",
  ],
  address: {
    streetAddress: "28 Thi Sách, Phường Thắng Tam",
    addressLocality: "Vũng Tàu",
    addressRegion: "Bà Rịa - Vũng Tàu",
    postalCode: "790000",
    addressCountry: "VN",
  },
  telephone: "+84-963-686-963",
  priceRange: "1.000.000đ - 5.000.000đ",
  starRating: {
    ratingValue: 4.8,
  },
  amenityFeature: [
    { name: "Hồ bơi vô cực" },
    { name: "Sauna & steam" },
    { name: "Sky Gym" },
    { name: "Công viên nước trẻ em" },
    { name: "View biển" },
  ],
});

const organizationSchema = generateOrganizationSchema({
  name: "Châu Homestay",
  url: "https://chauhomestay.com",
  logo: "https://chauhomestay.com/logo.png",
  contactPoint: {
    telephone: "+84-963-686-963",
    contactType: "customer support",
    areaServed: "VN",
  },
  sameAs: [
    "https://zalo.me/0963686963",
    "https://www.facebook.com/chauhomestaythesong",
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-900 antialiased`}
      >
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={organizationSchema} />
        <AuthProvider initialUser={session.user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
