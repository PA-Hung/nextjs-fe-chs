const RAW_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const API_VERSION_PATH = "/api/v1";

const normalizeBaseUrl = (url: string) => {
  if (!url) {
    return "";
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const normalizedBaseUrl = normalizeBaseUrl(RAW_API_BASE_URL);

export const appConfig = {
  apiBaseUrl: normalizedBaseUrl,
  apiVersionPath: API_VERSION_PATH,
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBaseUrl}${API_VERSION_PATH}${normalizedPath}`;
};

export type AppConfig = typeof appConfig;
