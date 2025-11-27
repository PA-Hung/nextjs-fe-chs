"use client";

import { useContext } from "react";

import { AuthContext } from "@/auth/context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider.");
  }

  return context;
};
