"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { equipmentSchema } from "@/lib/validations/equipment";

export async function getEquipment() {
  await requireRole("ADMIN");
  return prisma.equipment.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createEquipment(data: unknown) {
  await requireRole("ADMIN");

  const parsed = equipmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.equipment.create({
    data: {
      ...parsed.data,
      purchaseDate: new Date(parsed.data.purchaseDate),
    },
  });

  revalidatePath("/admin/equipment");
  return { success: true };
}

export async function updateEquipment(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = equipmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.equipment.update({
    where: { id },
    data: {
      ...parsed.data,
      purchaseDate: new Date(parsed.data.purchaseDate),
    },
  });

  revalidatePath("/admin/equipment");
  return { success: true };
}

export async function deleteEquipment(id: string) {
  await requireRole("ADMIN");
  await prisma.equipment.delete({ where: { id } });
  revalidatePath("/admin/equipment");
}
