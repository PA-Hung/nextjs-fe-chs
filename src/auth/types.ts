export type UserRole = "guest" | "host" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn?: number;
}

export interface AuthSession {
  user: User | null;
  accessToken?: string;
}
