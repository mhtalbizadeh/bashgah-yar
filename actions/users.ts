"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { createUserSchema, userSchema } from "@/lib/validations/user";

export async function getUsers(search?: string) {
  await requireRole("ADMIN");

  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMembers() {
  await requireRole(["ADMIN", "COACH"]);
  return prisma.user.findMany({
    where: { role: "MEMBER" },
    orderBy: { name: "asc" },
  });
}

export async function getCoaches() {
  await requireRole("ADMIN");
  return prisma.user.findMany({
    where: { role: "COACH" },
    orderBy: { name: "asc" },
  });
}

export async function createUser(data: unknown) {
  await requireRole("ADMIN");

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const existing = await prisma.user.findUnique({
    where: { phone: parsed.data.phone },
  });
  if (existing) {
    return { error: "کاربری با این شماره تماس قبلاً ثبت شده است." };
  }

  const password = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      role: parsed.data.role,
      password,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUser(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = userSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const existing = await prisma.user.findFirst({
    where: { phone: parsed.data.phone, NOT: { id } },
  });
  if (existing) {
    return { error: "کاربری با این شماره تماس قبلاً ثبت شده است." };
  }

  await prisma.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      role: parsed.data.role,
      ...(parsed.data.password
        ? { password: await bcrypt.hash(parsed.data.password, 10) }
        : {}),
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  await requireRole("ADMIN");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
