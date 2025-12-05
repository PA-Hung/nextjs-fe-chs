import "server-only";

import { buildApiUrl } from "@/lib/config";
import type { ProductTypeInternal } from "@/lib/types/product-type";
import type { ZaloProduct, ZaloProductListResponse } from "@/lib/types/zalo";
import { createProductSlug, parseSlugToId } from "@/lib/utils/slug";

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
 * Ưu tiên query trực tiếp theo slug từ API, fallback về cách cũ nếu cần
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

  // Ưu tiên: Thử query trực tiếp theo slug từ API (nếu BE có endpoint này)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    // Thử endpoint mới: /api/v1/apartment/by-slug/:slug
    const response = await fetch(buildApiUrl(`/apartment/by-slug/${slug}`), {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        statusCode: number;
        message: string;
        data: ZaloProduct;
      };

      if (payload.data) {
        return payload.data;
      }
    }
  } catch {
    // Nếu endpoint không tồn tại hoặc lỗi, fallback về cách cũ
  } finally {
    clearTimeout(timeout);
  }

  // Fallback: Query tất cả sản phẩm và tìm theo slug
  const allProducts = await getZaloProducts({ current: 1, pageSize: 1000 });

  // Ưu tiên tìm theo slug từ API (nếu có)
  for (const product of allProducts.result) {
    if (product.slug && product.slug === slug) {
      return product;
    }
  }

  // Backward compatibility: Nếu product chưa có slug, thử generate từ name
  for (const product of allProducts.result) {
    const productSlug = createProductSlug(product.name);
    if (productSlug === slug) {
      return product;
    }
  }

  // Backward compatibility: Thử tìm theo slug cũ có ID (format: {name}-{6chars})
  const shortId = parseSlugToId(slug);
  if (shortId) {
    const slugWithoutId = slug.replace(`-${shortId}$`, "");
    for (const product of allProducts.result) {
      if (
        product.slug &&
        (product.slug === slug || product.slug === slugWithoutId)
      ) {
        return product;
      }
      const productSlug = createProductSlug(product.name);
      if (productSlug === slug || productSlug === slugWithoutId) {
        return product;
      }
    }
  }

  throw new Error("Không tìm thấy căn hộ này.");
}
