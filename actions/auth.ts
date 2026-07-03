"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export async function login(data: LoginInput) {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return "اطلاعات وارد شده معتبر نیست.";
  }

  try {
    await signIn("credentials", {
      phone: parsed.data.phone,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "شماره تماس یا رمز عبور اشتباه است.";
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
