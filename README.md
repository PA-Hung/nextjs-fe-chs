## Chau Homestay Frontend

Frontend Next.js 15 (App Router) cho website [chauhomestay.com](https://chauhomestay.com), kết nối với backend NestJS hiện có để quản lý căn hộ The Sóng, villa và blog/guide book.

### Công nghệ chính

- Next.js App Router (React Server Components mặc định)
- TypeScript + Tailwind CSS
- Tích hợp API NestJS qua REST
- SEO-first: metadata động, Open Graph, chuẩn bị JSON-LD

### Cấu trúc thư mục

```
src/
  app/            // Routing & layout
  auth/           // Hệ thống authentication (API client, context, hooks, UI)
  components/     // (sẽ bổ sung) UI components tái sử dụng
  lib/            // Helpers, config, types dùng chung
public/           // Assets tĩnh
```

### Thiết lập môi trường

Tạo file `.env.local` tại root dự án:

```
NEXT_PUBLIC_API_URL=https://api.chauhomestay.com
AUTH_ACCESS_COOKIE_NAME=chauhomestay_access
AUTH_REFRESH_COOKIE_NAME=chauhomestay_refresh
AUTH_REQUEST_TIMEOUT_MS=8000
NEXT_PUBLIC_FEATURABLE_WIDGET_ID=your-featurable-widget-id
```

Các biến có thể điều chỉnh tùy môi trường deploy.

**Lưu ý về Google Reviews:**

- Để hiển thị đánh giá Google, bạn cần tạo tài khoản miễn phí tại [Featurable.com](https://featurable.com)
- Tạo widget mới và copy Widget ID vào biến `NEXT_PUBLIC_FEATURABLE_WIDGET_ID`
- Component `GoogleReviewsSection` sẽ tự động fetch và hiển thị đánh giá từ Google Business Profile

### Chạy dự án

```bash
npm install
npm run dev # chạy ở http://localhost:3200
```

### Hệ thống Authentication

- Module `src/auth/` gồm:
  - `api.ts`: Gọi NestJS REST API (`/auth/login`, `/auth/me`, `/auth/refresh`…)
  - `session.ts`: Server session + cookies (access & refresh token)
  - `actions.ts`: Server Actions `loginAction`, `logoutAction`
  - `context/`, `hooks/`, `components/`: AuthProvider, `useAuth`, `LoginForm`
- Root layout fetch session server-side và bọc toàn app bằng `AuthProvider`
- Form đăng nhập mẫu đặt ở trang chủ (`src/app/page.tsx`)

### Lint & format

```
npm run lint
```

### Ghi chú thêm

- Luôn ưu tiên Server Components để giảm bundle
- Chỉ dùng Client Components cho phần interactive (ví dụ LoginForm)
- Cập nhật metadata từng page bằng `generateMetadata` khi xây màn hình mới
