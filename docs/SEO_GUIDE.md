# Hướng dẫn SEO cho Blog và Sản phẩm trong Next.js

## Tổng quan

Tài liệu này mô tả các cấu hình SEO cần thiết cho blog và sản phẩm trong Next.js App Router.

## 1. Metadata API (generateMetadata)

### Cấu hình cơ bản

Mỗi page cần export function `generateMetadata` để tạo metadata động:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(params);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
    },
    alternates: {
      canonical: `/path/${params.slug}`,
    },
  };
}
```

### Các trường metadata quan trọng

- **title**: Tiêu đề trang (50-60 ký tự)
- **description**: Mô tả ngắn (150-160 ký tự)
- **openGraph**: Cho Facebook, LinkedIn
- **twitter**: Cho Twitter/X
- **alternates.canonical**: URL chính thức, tránh duplicate content
- **keywords**: Từ khóa (tùy chọn, Google không dùng nữa nhưng vẫn có thể hữu ích)

## 2. JSON-LD Structured Data

### Tại sao cần JSON-LD?

- Giúp Google hiểu rõ hơn về nội dung
- Hiển thị rich snippets trong kết quả tìm kiếm
- Tăng CTR (Click-Through Rate)

### Các loại schema phổ biến

#### Product Schema (cho căn hộ/villa)

```typescript
import { JsonLd } from "@/components/seo/JsonLd";
import { generateProductSchema } from "@/lib/seo/jsonld";

const productSchema = {
  name: "Căn hộ The Sóng 3PN",
  description: "...",
  image: "/apartment/cover.jpg",
  price: 2000000,
  priceCurrency: "VND",
  availability: "InStock",
  url: "https://chauhomestay.com/can-ho-the-song/slug",
};

return (
  <>
    <JsonLd data={generateProductSchema(productSchema)} />
    {/* Component content */}
  </>
);
```

#### Article Schema (cho blog)

```typescript
import { generateArticleSchema } from "@/lib/seo/jsonld";

const articleSchema = {
  headline: "Hướng dẫn du lịch Vũng Tàu",
  description: "...",
  image: "/blog/cover.jpg",
  datePublished: "2024-01-15T10:00:00Z",
  author: { name: "Châu Homestay" },
  publisher: { name: "Châu Homestay" },
  url: "https://chauhomestay.com/blog/slug",
};

return (
  <>
    <JsonLd data={generateArticleSchema(articleSchema)} />
    {/* Component content */}
  </>
);
```

## 3. Open Graph & Twitter Cards

### Open Graph (Facebook, LinkedIn)

```typescript
openGraph: {
  title: "Tiêu đề",
  description: "Mô tả",
  url: "https://chauhomestay.com/path",
  siteName: "Châu Homestay",
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Mô tả ảnh",
    },
  ],
  locale: "vi_VN",
  type: "article" | "website" | "product",
}
```

### Twitter Cards

```typescript
twitter: {
  card: "summary_large_image",
  title: "Tiêu đề",
  description: "Mô tả",
  images: ["/twitter-image.jpg"],
}
```

## 4. Canonical URLs

Luôn đặt canonical URL để tránh duplicate content:

```typescript
alternates: {
  canonical: `/can-ho-the-song/${slug}`,
}
```

**Lưu ý**:

- URL phải là relative path (không có domain)
- Next.js tự động thêm domain từ `metadataBase` trong root layout

## 5. Semantic HTML

Sử dụng đúng HTML5 semantic tags:

- `<article>`: Cho bài blog
- `<section>`: Cho các phần nội dung
- `<header>`: Header của trang
- `<footer>`: Footer
- `<main>`: Nội dung chính
- `<nav>`: Navigation
- `<time>`: Cho ngày tháng với `dateTime` attribute

**Ví dụ**:

```tsx
<article>
  <header>
    <h1>Tiêu đề bài viết</h1>
    <time dateTime="2024-01-15">15/01/2024</time>
  </header>
  <main>
    <section>{/* Nội dung */}</section>
  </main>
</article>
```

## 6. Image Optimization

### Sử dụng Next.js Image component

```tsx
import Image from "next/image";

<Image
  src="/apartment/cover.jpg"
  alt="Mô tả ảnh chi tiết"
  width={1200}
  height={630}
  priority // Cho ảnh above-the-fold
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>;
```

### Best practices

- **Alt text**: Mô tả rõ ràng, có từ khóa nhưng tự nhiên
- **Priority**: Đặt `priority` cho ảnh hero/above-the-fold
- **Sizes**: Định nghĩa sizes để tối ưu responsive
- **Format**: Sử dụng WebP/AVIF khi có thể

## 7. Sitemap & Robots.txt

### Sitemap (src/app/sitemap.ts)

Next.js tự động generate sitemap từ file này:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://chauhomestay.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // ... more routes
  ];
}
```

### Robots.txt (src/app/robots.ts)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://chauhomestay.com/sitemap.xml",
  };
}
```

## 8. Checklist SEO cho mỗi trang

### Trang sản phẩm (Căn hộ/Villa)

- [ ] `generateMetadata` với title, description, OG tags
- [ ] JSON-LD Product schema
- [ ] Canonical URL
- [ ] 1 H1 tag duy nhất
- [ ] Semantic HTML (`<article>`, `<section>`)
- [ ] Breadcrumb navigation
- [ ] Alt text cho tất cả ảnh
- [ ] Internal links đến các sản phẩm liên quan
- [ ] Meta description có từ khóa chính

### Trang blog

- [ ] `generateMetadata` với type "article"
- [ ] JSON-LD Article schema
- [ ] Canonical URL
- [ ] 1 H1 tag duy nhất
- [ ] Semantic HTML (`<article>`, `<time>`)
- [ ] Author information
- [ ] Published/Modified dates
- [ ] Tags/Categories
- [ ] Related posts links
- [ ] Table of contents (cho bài dài)

## 9. Testing SEO

### Tools kiểm tra

1. **Google Rich Results Test**: https://search.google.com/test/rich-results

   - Kiểm tra JSON-LD schema

2. **Google Search Console**:

   - Monitor indexing
   - Xem search performance

3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/

   - Kiểm tra Open Graph tags

4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Kiểm tra Twitter Cards

## 10. Performance & Core Web Vitals

SEO cũng phụ thuộc vào performance:

- **LCP (Largest Contentful Paint)**: < 2.5s

  - Tối ưu ảnh hero với `priority`
  - Preload critical resources

- **FID (First Input Delay)**: < 100ms

  - Giảm JavaScript blocking

- **CLS (Cumulative Layout Shift)**: < 0.1
  - Đặt kích thước cố định cho ảnh
  - Tránh content shift

## 11. Ví dụ hoàn chỉnh

Xem các file example:

- `src/app/blog/[slug]/page.example.tsx` - Ví dụ blog
- `src/app/can-ho-the-song/[slug]/page.enhanced.example.tsx` - Ví dụ sản phẩm nâng cao

## 12. Lưu ý quan trọng

1. **Metadata phải unique**: Mỗi trang có title/description riêng
2. **URL thân thiện SEO**: `/can-ho-the-song/3pn-view-bien` tốt hơn `/product/123`
3. **Internal linking**: Liên kết giữa các trang liên quan
4. **Mobile-first**: Đảm bảo responsive, mobile-friendly
5. **HTTPS**: Bắt buộc cho SEO tốt
6. **Page speed**: Tối ưu loading time

## Tài liệu tham khảo

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
