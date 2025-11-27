import { AUTH_API_BASE_URL, AUTH_REQUEST_TIMEOUT_MS } from "@/auth/config";
import type {
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
} from "@/auth/types";

type RequestOptions = RequestInit & {
  skipJson?: boolean;
};

const safeParseJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async <T>(
  path: string,
  options?: RequestOptions
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    AUTH_REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorPayload = await safeParseJson(response);
      const message =
        (errorPayload as { message?: string } | null)?.message ??
        "Không thể kết nối đến dịch vụ xác thực.";
      throw new Error(message);
    }

    if (options?.skipJson) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Yêu cầu xác thực quá thời gian cho phép.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const login = (credentials: AuthCredentials) =>
  request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const register = (payload: RegisterPayload) =>
  request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const refreshSession = (refreshToken: string) =>
  request<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

export const getProfile = (accessToken: string) =>
  request<User>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
