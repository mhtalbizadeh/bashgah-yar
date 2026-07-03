"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/auth-guard";
import { productSchema } from "@/lib/validations/product";

export async function getProducts() {
  await requireUser();
  return prisma.product.findMany({ orderBy: { name: "asc" } });
}

export async function createProduct(data: unknown) {
  await requireRole("ADMIN");

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.product.create({ data: parsed.data });
  revalidatePath("/admin/products");
  revalidatePath("/member/products");
  return { success: true };
}

export async function updateProduct(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.product.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/products");
  revalidatePath("/member/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireRole("ADMIN");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/member/products");
}
