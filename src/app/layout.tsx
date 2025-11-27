import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/auth/context/AuthProvider";
import { getServerSession } from "@/auth/session";

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
        <AuthProvider initialUser={session.user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
