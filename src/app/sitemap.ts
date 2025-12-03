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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ve-chung-toi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic routes - fetch từ API
  try {
    const { getZaloProducts } = await import("@/lib/api/zalo");
    const apartmentsData = await getZaloProducts({
      current: 1,
      pageSize: 1000,
    });
    const apartmentsRoutes = apartmentsData.result.map((apt) => ({
      url: `${baseUrl}/can-ho-the-song/${apt.slug || apt._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...apartmentsRoutes];
  } catch {
    // Nếu không fetch được, chỉ trả về static routes
    return staticRoutes;
  }
}
