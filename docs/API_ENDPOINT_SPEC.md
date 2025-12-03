# API Endpoint Specification: Get Product by Slug

## Yêu cầu Backend

### Endpoint: Get Product by Slug

**Mục đích**: Query sản phẩm trực tiếp theo slug thay vì phải fetch tất cả products và filter ở frontend.

---

## Specification

### 1. Endpoint Details

```
Method: GET
URL: /api/v1/zalo-products/by-slug/:slug
```

**Ví dụ URL**:

```
GET /api/v1/zalo-products/by-slug/can-ho-the-song-3pn-view-bien-havila-luxury
```

### 2. Request Parameters

#### Path Parameter

- `slug` (string, required): Slug của sản phẩm
  - Format: lowercase, không dấu, dùng dấu gạch ngang
  - Ví dụ: `can-ho-the-song-3pn-view-bien-havila-luxury`
  - Không có query parameters khác

### 3. Response Format

#### Success Response (200 OK)

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Căn hộ The Sóng 3PN View Biển Havila Luxury",
    "slug": "can-ho-the-song-3pn-view-bien-havila-luxury",
    "productType": "apartment",
    "maxGuests": 6,
    "area": 120,
    "bedrooms": 3,
    "bathrooms": 2,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "priceNormal": 2000000,
    "location": "The Sóng, Vũng Tàu",
    "amenities": ["WiFi", "Điều hòa", "TV", "Bếp", "Máy giặt"],
    "coverImageUrl": "https://example.com/cover.jpg",
    "description": "Căn hộ hiện đại với view biển tuyệt đẹp..."
  }
}
```

#### Error Response (404 Not Found)

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy sản phẩm với slug này.",
  "data": null
}
```

#### Error Response (500 Internal Server Error)

```json
{
  "statusCode": 500,
  "message": "Lỗi server khi tìm kiếm sản phẩm.",
  "data": null
}
```

### 4. Response Headers

```
Content-Type: application/json
```

### 5. Database Query

Backend nên query trực tiếp theo field `slug`:

**MongoDB Example**:

```javascript
const product = await Product.findOne({ slug: slug });
```

**SQL Example**:

```sql
SELECT * FROM products WHERE slug = :slug LIMIT 1;
```

### 6. Performance Requirements

- **Response Time**: < 500ms (tối ưu với database index)
- **Database Index**: Nên có index trên field `slug` để query nhanh
  ```javascript
  // MongoDB
  db.products.createIndex({ slug: 1 }, { unique: true });
  ```

---

## Implementation Notes

### 1. Slug Validation

- Slug phải match với format: lowercase, không dấu, dùng dấu gạch ngang
- Nếu slug không hợp lệ, trả về 400 Bad Request

### 2. Case Sensitivity

- Slug matching nên **case-insensitive** hoặc đảm bảo slug luôn lowercase trong database
- Frontend sẽ gửi slug đã được normalize (lowercase)

### 3. Error Handling

- **404**: Khi không tìm thấy product với slug đó
- **400**: Khi slug format không hợp lệ
- **500**: Khi có lỗi server/database

### 4. Caching (Optional)

- Có thể cache response nếu cần (nhưng frontend đang dùng `cache: "no-store"`)
- Nếu cache, nên có cache invalidation khi product được update

---

## Example Implementation (NestJS)

```typescript
// zalo-products.controller.ts
@Get('by-slug/:slug')
async getProductBySlug(@Param('slug') slug: string) {
  const product = await this.zaloProductsService.findBySlug(slug);

  if (!product) {
    throw new NotFoundException('Không tìm thấy sản phẩm với slug này.');
  }

  return {
    statusCode: 200,
    message: 'Success',
    data: product,
  };
}

// zalo-products.service.ts
async findBySlug(slug: string): Promise<ZaloProduct | null> {
  return this.productModel.findOne({ slug: slug.toLowerCase() }).exec();
}
```

---

## Testing

### Test Cases

1. **Valid slug - Product exists**

   ```
   GET /api/v1/zalo-products/by-slug/can-ho-the-song-3pn-view-bien
   Expected: 200 OK với data
   ```

2. **Valid slug - Product not found**

   ```
   GET /api/v1/zalo-products/by-slug/non-existent-slug
   Expected: 404 Not Found
   ```

3. **Invalid slug format**

   ```
   GET /api/v1/zalo-products/by-slug/invalid@slug#format
   Expected: 400 Bad Request (nếu có validation)
   ```

4. **Empty slug**
   ```
   GET /api/v1/zalo-products/by-slug/
   Expected: 404 hoặc 400
   ```

---

## Frontend Integration

Frontend code đã sẵn sàng sử dụng endpoint này:

```typescript
// src/lib/api/zalo.ts
const response = await fetch(`${apiUrl}/api/v1/zalo-products/by-slug/${slug}`, {
  signal: controller.signal,
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
  },
});
```

Nếu endpoint chưa có, frontend sẽ tự động fallback về cách cũ (fetch tất cả và filter).

---

## Checklist cho Backend

- [ ] Tạo endpoint `GET /api/v1/zalo-products/by-slug/:slug`
- [ ] Query database theo field `slug`
- [ ] Trả về format response giống như endpoint `GET /api/v1/zalo-products/:id`
- [ ] Xử lý error 404 khi không tìm thấy
- [ ] Tạo index trên field `slug` trong database (unique)
- [ ] Test với các slug hợp lệ và không hợp lệ
- [ ] Đảm bảo response time < 500ms

---

## Lưu ý quan trọng

1. **Format response phải giống hệt** endpoint `GET /api/v1/zalo-products/:id` để đảm bảo consistency
2. **Slug phải unique** trong database (nên có unique constraint)
3. **Case-insensitive matching** hoặc đảm bảo slug luôn lowercase
4. **Index trên slug** để query nhanh (quan trọng cho performance)
