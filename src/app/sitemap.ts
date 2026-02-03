/**
 * Sitemap tự động cho Next.js
 * Next.js sẽ tự động generate sitemap từ file này
 */

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chauhomestay.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/can-ho-the-song`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/villa`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide-book`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bao-gia-tu-dong`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dat-phong`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/noi-quy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic routes - fetch từ API
  try {
    const { getZaloProducts } = await import("@/lib/api/zalo");
    const { getBlogTravelPosts } = await import("@/lib/api/blog-list");

    const apartmentsData = await getZaloProducts({
      current: 1,
      pageSize: 1000,
      productType: "apartment",
    });
    const apartmentsRoutes = apartmentsData.result.map((apt) => ({
      url: `${baseUrl}/can-ho-the-song/${apt.slug || apt._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const villasData = await getZaloProducts({
      current: 1,
      pageSize: 1000,
      productType: "villa",
    });
    const villasRoutes = villasData.result.map((villa) => ({
      url: `${baseUrl}/villa/${villa.slug || villa._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const blogData = await getBlogTravelPosts({ current: 1, pageSize: 500 });
    const blogRoutes = blogData.result.map((post) => ({
      url: `${baseUrl}/guide-book/${post.slug}`,
      lastModified: new Date(
        post.updatedAt || post.publishedAt || post.createdAt
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...apartmentsRoutes,
      ...villasRoutes,
      ...blogRoutes,
    ];
  } catch {
    // Nếu không fetch được, chỉ trả về static routes
    return staticRoutes;
  }
}
