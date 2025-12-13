import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://chauhomestay.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
