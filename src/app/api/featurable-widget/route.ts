import { NextRequest, NextResponse } from "next/server";

import { appConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const widgetIdParam = searchParams.get("widgetId");

  // Ưu tiên widgetId từ query params, nếu không có thì dùng default
  const widgetId = widgetIdParam || appConfig.featurableWidgetId;

  if (!widgetId) {
    return NextResponse.json(
      { error: "Widget ID not configured" },
      { status: 400 }
    );
  }

  try {
    // Gọi Featurable API v2
    const response = await fetch(
      `https://featurable.com/api/v2/widgets/${widgetId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 3600, // Cache 1 giờ
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Featurable API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Featurable widget:", error);
    return NextResponse.json(
      { error: "Failed to fetch widget data" },
      { status: 500 }
    );
  }
}
