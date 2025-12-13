import "server-only";

import { buildApiUrl } from "@/lib/config";
import type { ProductTypeInternal } from "@/lib/types/product-type";
import type { ZaloProduct, ZaloProductListResponse } from "@/lib/types/zalo";

const API_TIMEOUT = 15000;

interface GetZaloProductsParams {
  current?: number;
  pageSize?: number;
  bedrooms?: number;
  productType?: ProductTypeInternal;
}

export async function getZaloProducts(params?: GetZaloProductsParams) {
  const { current = 1, pageSize = 9, bedrooms, productType } = params ?? {};

  const searchParams = new URLSearchParams({
    current: String(current),
    pageSize: String(pageSize),
    sort: "-createdAt",
  });

  if (bedrooms && bedrooms > 0) {
    searchParams.set("bedrooms", String(bedrooms));
  }

  if (productType) {
    searchParams.set("productType", productType);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(
      `${buildApiUrl("/apartment")}?${searchParams.toString()}`,
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(buildApiUrl(`/apartment/${id}`), {
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
 * Backend endpoint: GET /apartment/:slug
 */
export async function getZaloProductBySlug(slug: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(buildApiUrl(`/apartment/${slug}`), {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        const notFoundError = new Error("APARTMENT_NOT_FOUND");
        notFoundError.name = "NotFoundError";
        throw notFoundError;
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
  } finally {
    clearTimeout(timeout);
  }
}
