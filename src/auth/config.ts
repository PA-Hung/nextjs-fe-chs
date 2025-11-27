const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!AUTH_API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL chưa được cấu hình. Vui lòng bổ sung vào file .env."
  );
}

const AUTH_COOKIE_NAME =
  process.env.AUTH_ACCESS_COOKIE_NAME ?? "chauhomestay_access";
const AUTH_REFRESH_COOKIE_NAME =
  process.env.AUTH_REFRESH_COOKIE_NAME ?? "chauhomestay_refresh";
const AUTH_REQUEST_TIMEOUT_MS = Number(
  process.env.AUTH_REQUEST_TIMEOUT_MS ?? "8000"
);

export {
  AUTH_API_BASE_URL,
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  AUTH_REQUEST_TIMEOUT_MS,
};
