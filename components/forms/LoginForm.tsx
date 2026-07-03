"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { login } from "@/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await login(data);
      if (result) setServerError(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 rounded-xl border border-transparent bg-slate-50 px-4 py-3.5 focus-within:border-primary">
          <FiPhone className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="شماره تماس"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 rounded-xl border border-transparent bg-slate-50 px-4 py-3.5 focus-within:border-primary">
          <FiLock className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="h-4 w-4" />
            ) : (
              <FiEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          {...register("remember")}
        />
        مرا به خاطر بسپار
      </label>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "در حال ورود..." : "ورود به پنل مدیریت"}
      </button>
    </form>
  );
}
