/**
 * Helper functions cho metadata SEO
 */

import type { Metadata } from "next";

export interface SeoMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Tạo metadata object cho Next.js từ dữ liệu SEO
 */
export const generateSeoMetadata = (
  seo: SeoMetadata,
  baseUrl: string = "https://chauhomestay.com"
): Metadata => {
  const fullUrl = seo.url ? `${baseUrl}${seo.url}` : baseUrl;
  const imageUrl = seo.image
    ? seo.image.startsWith("http")
      ? seo.image
      : `${baseUrl}${seo.image}`
    : `${baseUrl}/og-image.jpg`;

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: fullUrl,
      siteName: "Châu Homestay",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: "vi_VN",
      type: seo.type || "website",
      ...(seo.publishedTime && { publishedTime: seo.publishedTime }),
      ...(seo.modifiedTime && { modifiedTime: seo.modifiedTime }),
      ...(seo.author && {
        authors: [{ name: seo.author }],
      }),
      ...(seo.tags && { tags: seo.tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: seo.url || "/",
    },
    ...(seo.tags && { keywords: seo.tags }),
  };
};
