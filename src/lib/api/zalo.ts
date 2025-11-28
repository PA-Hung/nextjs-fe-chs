import "server-only";

import { appConfig } from "@/lib/config";
import type { ZaloProduct, ZaloProductListResponse } from "@/lib/types/zalo";
import { createProductSlug, parseSlugToId } from "@/lib/utils/slug";

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
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Không tìm thấy căn hộ này.");
      }
      const errorText = await response.text();
      throw new Error(
        `Không thể tải thông tin căn hộ. Status: ${response.status}. ${errorText}`
      );
    }

    const payload = (await response.json()) as {
      statusCode: number;
      message: string;
      data: ZaloProduct;
    };

    if (!payload.data) {
      throw new Error("Dữ liệu sản phẩm không hợp lệ.");
    }

    return payload.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Không thể tải thông tin căn hộ. Vui lòng thử lại.");
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Lấy sản phẩm theo slug
 * Hỗ trợ cả slug mới (chỉ tên) và slug cũ (có ID), và ID thuần (backward compatible)
 */
export async function getZaloProductBySlug(slug: string) {
  // Kiểm tra nếu slug là ID thuần (24 ký tự hex - MongoDB ObjectId format)
  if (/^[a-f0-9]{24}$/i.test(slug)) {
    // Nếu là ID thuần, query trực tiếp
    try {
      return await getZaloProductById(slug);
    } catch {
      throw new Error("Không tìm thấy căn hộ này.");
    }
  }

  // Query tất cả sản phẩm và tìm theo slug
  const allProducts = await getZaloProducts({ current: 1, pageSize: 1000 });

  // Ưu tiên tìm theo slug mới (chỉ tên, không có ID)
  for (const product of allProducts.result) {
    const productSlug = createProductSlug(product.name);
    if (productSlug === slug) {
      return product;
    }
  }

  // Backward compatibility: Nếu không tìm thấy, thử tìm theo slug cũ có ID (format: {name}-{6chars})
  const shortId = parseSlugToId(slug);
  if (shortId) {
    // Loại bỏ phần ID khỏi slug để lấy phần tên
    const slugWithoutId = slug.replace(`-${shortId}$`, "");
    for (const product of allProducts.result) {
      const productSlug = createProductSlug(product.name);
      // Kiểm tra xem slug có khớp với tên (có hoặc không có ID)
      if (productSlug === slug || productSlug === slugWithoutId) {
        return product;
      }
    }
  }

  throw new Error("Không tìm thấy căn hộ này.");
}
