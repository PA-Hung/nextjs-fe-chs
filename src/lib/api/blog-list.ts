import "server-only";

import { buildApiUrl } from "@/lib/config";
import type { BlogTravelPost } from "@/lib/types/blog";

const API_TIMEOUT = 15000;

export interface BlogTravelListMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface BlogTravelListResponse {
  statusCode: number;
  message: string;
  data: {
    meta: BlogTravelListMeta;
    result: BlogTravelPost[];
  };
}

interface GetBlogTravelListParams {
  current?: number;
  pageSize?: number;
}

/**
 * Lấy danh sách blog du lịch (PUBLIC, chỉ published)
 * Backend endpoint (giả định): GET /blog-travel?current=&pageSize=
 */
export const getBlogTravelPosts = async (
  params?: GetBlogTravelListParams
): Promise<{ meta: BlogTravelListMeta; result: BlogTravelPost[] }> => {
  const { current = 1, pageSize = 6 } = params ?? {};

  const searchParams = new URLSearchParams({
    current: String(current),
    pageSize: String(pageSize),
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(
      `${buildApiUrl("/blog-travel")}?${searchParams.toString()}`,
      {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Không thể tải danh sách blog du lịch. Status: ${response.status}. ${errorText}`
      );
    }

    const payload = (await response.json()) as BlogTravelListResponse;

    if (!payload.data || !payload.data.result) {
      throw new Error("Dữ liệu danh sách blog không hợp lệ.");
    }

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
};
