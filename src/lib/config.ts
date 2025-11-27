const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls may fail.");
}

export const appConfig = {
  apiBaseUrl: API_BASE_URL,
};

export type AppConfig = typeof appConfig;
