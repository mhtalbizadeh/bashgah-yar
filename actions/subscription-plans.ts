"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { subscriptionPlanSchema } from "@/lib/validations/subscription-plan";

export async function getSubscriptionPlans() {
  await requireRole(["ADMIN", "COACH", "MEMBER"]);
  return prisma.subscriptionPlan.findMany({ orderBy: { price: "asc" } });
}

export async function createSubscriptionPlan(data: unknown) {
  await requireRole("ADMIN");

  const parsed = subscriptionPlanSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.subscriptionPlan.create({ data: parsed.data });
  revalidatePath("/admin/plans");
  return { success: true };
}

export async function updateSubscriptionPlan(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = subscriptionPlanSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.subscriptionPlan.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/plans");
  return { success: true };
}

export async function deleteSubscriptionPlan(id: string) {
  await requireRole("ADMIN");
  await prisma.subscriptionPlan.delete({ where: { id } });
  revalidatePath("/admin/plans");
}
