import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Cho phép cross-origin requests từ các IP/domain trong mạng local khi dev
  allowedDevOrigins:
    process.env.NODE_ENV === "development" ? ["192.168.3.76"] : [],
  // Redirect từ /blog sang /guide-book để tối ưu SEO
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/guide-book",
        permanent: true, // 301 redirect
      },
      {
        source: "/blog/:slug",
        destination: "/guide-book/:slug",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
