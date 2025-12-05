import { NextResponse } from "next/server";

import { getZaloProducts } from "@/lib/api/zalo";
import { parseProductTypeFromQuery } from "@/lib/types/product-type";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentParam = Number(searchParams.get("current"));
  const pageSizeParam = Number(searchParams.get("pageSize"));
  const productTypeParam = searchParams.get("productType");

  const current =
    Number.isFinite(currentParam) && currentParam > 0 ? currentParam : 1;
  const pageSize =
    Number.isFinite(pageSizeParam) && pageSizeParam > 0 ? pageSizeParam : 5;
  const productType = parseProductTypeFromQuery(productTypeParam);

  try {
    const data = await getZaloProducts({
      current,
      pageSize,
      ...(productType ? { productType } : {}),
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Không thể tải danh sách căn hộ. Vui lòng thử lại.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
