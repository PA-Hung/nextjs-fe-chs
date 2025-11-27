import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME } from "@/auth/config";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const setAuthCookies = async ({
  accessToken,
  refreshToken,
}: AuthTokens) => {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60, // 1 giờ
  });

  cookieStore.set(AUTH_REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
  });
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(AUTH_REFRESH_COOKIE_NAME);
};
