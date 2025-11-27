import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME } from "@/auth/config";
import { getProfile, refreshSession } from "@/auth/api";
import { clearAuthCookies, setAuthCookies } from "@/auth/cookies";
import type { AuthResponse, AuthSession } from "@/auth/types";

export const getServerSession = async (): Promise<AuthSession> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return { user: null };
  }

  try {
    const user = await getProfile(accessToken);
    return { user, accessToken };
  } catch {
    const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      await clearAuthCookies();
      return { user: null };
    }

    try {
      const refreshed = await refreshSession(refreshToken);
      await setAuthCookies(refreshed);
      return { user: refreshed.user, accessToken: refreshed.accessToken };
    } catch {
      await clearAuthCookies();
      return { user: null };
    }
  }
};

export const createServerSession = async (
  payload: AuthResponse
): Promise<AuthSession> => {
  await setAuthCookies(payload);
  return { user: payload.user, accessToken: payload.accessToken };
};

export const destroyServerSession = async () => {
  await clearAuthCookies();
};
