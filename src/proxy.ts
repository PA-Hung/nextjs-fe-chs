import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy handles deprecated WordPress URLs
 * Returns HTTP 410 Gone so Google Search Console removes them from index quickly
 *
 * Blocked URLs:
 * - /tag/[slug] (old tag archive)
 * - /tag/[slug]/page/[n] (tag pagination)
 * - /author/[name] (author archive)
 * - /san-pham/[slug] (old WooCommerce product)
 * - /YYYY/MM (monthly archive)
 */

// Helper function để tạo response 410 Gone
function gone410Response() {
  return new NextResponse("Gone - This page no longer exists", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Chặn toàn bộ tag archive cũ từ WordPress
  if (pathname.startsWith("/tag/")) {
    return gone410Response();
  }

  // Block old WordPress date archive URLs
  // Pattern: /YYYY/MM or /YYYY/MM/...
  const yearMonthPattern = /^\/\d{4}\/\d{2}(\/|$)/;
  if (yearMonthPattern.test(pathname)) {
    return gone410Response();
  }

  // Block old WordPress author archive URLs
  // Pattern: /author/* (like /author/admin, /author/admin/page/4)
  if (pathname.startsWith("/author/")) {
    return gone410Response();
  }

  // Block old WooCommerce product URLs
  // Pattern: /san-pham/* (old product pages)
  if (pathname.startsWith("/san-pham/")) {
    return gone410Response();
  }

  return NextResponse.next();
}

// Matcher đơn giản - proxy sẽ chạy cho tất cả request
// Logic filter chi tiết được xử lý trong function proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
