import "server-only";

import { buildApiUrl } from "@/lib/config";
import type { BlogTravelPost, BlogTravelResponse } from "@/lib/types/blog";

const API_TIMEOUT = 15000;

/**
 * Lấy chi tiết blog du lịch theo slug (PUBLIC)
 * Backend endpoint: GET /blog-travel/:slug
 */
export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogTravelPost> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(buildApiUrl(`/blog-travel/${slug}`), {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Để page.tsx có thể phân biệt 404
        const notFoundError = new Error("BLOG_POST_NOT_FOUND");
        notFoundError.name = "NotFoundError";
        throw notFoundError;
      }

      const errorText = await response.text();
      throw new Error(
        `Không thể tải chi tiết blog du lịch. Status: ${response.status}. ${errorText}`
      );
    }

    const payload = (await response.json()) as BlogTravelResponse;

    if (!payload.data) {
      throw new Error("Dữ liệu blog không hợp lệ.");
    }

    // Đảm bảo chỉ trả về bài viết đã publish (BE đã filter, nhưng check thêm cho chắc)
    if (payload.data.status !== "published") {
      const notFoundError = new Error("BLOG_POST_NOT_FOUND");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
};
