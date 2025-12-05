'use client';

import { useState } from "react";

import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormState {
  email: string;
  password: string;
}

const initialState: FormState = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { handleLogin, loading } = useAuth();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!formState.email || !formState.password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      await handleLogin({
        email: formState.email,
        password: formState.password,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập, vui lòng thử lại.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Form đăng nhập Chau Homestay"
      className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-lg backdrop-blur"
    >
      <header className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
          Chau Homestay Guest Portal
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900">
          Đăng nhập theo dõi đặt phòng của bạn
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Xem trạng thái đặt phòng, lịch lưu trú và thông tin check-in/out mọi lúc.
        </p>
      </header>

      <fieldset className="space-y-4" aria-live="polite">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formState.email}
          onChange={handleInputChange}
          required
          placeholder="you@example.com"
        />

        <label className="block text-sm font-medium text-zinc-700" htmlFor="password">
          Mật khẩu
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formState.password}
          onChange={handleInputChange}
          required
          placeholder="••••••••"
        />
      </fieldset>

      {errorMessage ? (
        <p role="alert" className="mt-4 text-sm text-rose-600">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-amber-600 px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;

