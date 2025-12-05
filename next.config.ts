import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bật cả domains và remotePatterns để tránh lỗi 400 khi proxy ảnh Cloudinary
    domains: ["res.cloudinary.com", "images.pexels.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Cho phép tất cả các query params từ Cloudinary
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Tối ưu cho Cloudinary - không cần optimize lại vì Cloudinary đã optimize
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    // Cloudinary đã tối ưu sẵn, tắt Next image optimizer để tránh 400 khi proxy trong Docker
    unoptimized: true,
  },
  // Cho phép cross-origin requests từ các IP/domain trong mạng local khi dev
  allowedDevOrigins:
    process.env.NODE_ENV === "development" ? ["192.168.3.76"] : [],
};

export default nextConfig;
