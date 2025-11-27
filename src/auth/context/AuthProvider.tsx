'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { loginAction, logoutAction } from "@/auth/actions";
import type { AuthCredentials, AuthSession, User } from "@/auth/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  handleLogin: (credentials: AuthCredentials) => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthSession["user"];
}

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    try {
      const response = await loginAction(credentials);
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Không thể đăng nhập, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutAction();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      handleLogin,
      handleLogout,
    }),
    [user, loading, handleLogin, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

