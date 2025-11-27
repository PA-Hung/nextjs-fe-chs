"use server";

import { login } from "@/auth/api";
import { createServerSession, destroyServerSession } from "@/auth/session";
import type { AuthCredentials, AuthResponse } from "@/auth/types";

const sanitizeCredentials = (
  credentials: AuthCredentials
): AuthCredentials => ({
  email: credentials.email.trim().toLowerCase(),
  password: credentials.password,
});

export const loginAction = async (
  credentials: AuthCredentials
): Promise<AuthResponse> => {
  const sanitized = sanitizeCredentials(credentials);
  const authResponse = await login(sanitized);
  await createServerSession(authResponse);
  return authResponse;
};

export const logoutAction = async () => {
  await destroyServerSession();
};
