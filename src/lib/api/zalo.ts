import "server-only";

import { appConfig } from "@/lib/config";
import type { ZaloProduct, ZaloProductListResponse } from "@/lib/types/zalo";

const API_TIMEOUT = 15000;

export async function getZaloProducts(params?: {
  current?: number;
  pageSize?: number;
}) {
  const { current = 1, pageSize = 9 } = params ?? {};

  const apiUrl = appConfig.apiBaseUrl;
  if (!apiUrl) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_API_URL."
    );
  }

  const searchParams = new URLSearchParams({
    current: String(current),
    pageSize: String(pageSize),
    sort: "-createdAt",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/zalo-products?${searchParams.toString()}`,
      {
        signal: controller.signal,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Không thể tải danh sách căn hộ. Vui lòng thử lại.");
    }

    const payload = (await response.json()) as ZaloProductListResponse;

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getZaloProductById(id: string) {
  const apiUrl = appConfig.apiBaseUrl;
  if (!apiUrl) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_API_URL."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${apiUrl}/api/v1/zalo-products/${id}`, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Không tìm thấy căn hộ này.");
      }
      throw new Error("Không thể tải thông tin căn hộ. Vui lòng thử lại.");
    }

    const payload = (await response.json()) as {
      statusCode: number;
      message: string;
      data: ZaloProduct;
    };

    return payload.data;
  } finally {
    clearTimeout(timeout);
  }
}
