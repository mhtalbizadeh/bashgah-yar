import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/lib/generated/prisma/client";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireRole(role: Role | Role[]) {
  const user = await requireUser();
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(user.role)) redirect("/");
  return user;
}
