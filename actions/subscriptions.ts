"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { subscriptionSchema } from "@/lib/validations/subscription";

export async function getSubscriptions() {
  await requireRole("ADMIN");
  return prisma.subscription.findMany({
    include: { member: true, plan: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMySubscription(memberId: string) {
  return prisma.subscription.findFirst({
    where: { memberId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSubscription(data: unknown) {
  await requireRole("ADMIN");

  const parsed = subscriptionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: parsed.data.planId },
  });
  if (!plan) {
    return { error: "پلن عضویت یافت نشد." };
  }

  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.subscription.create({
    data: {
      memberId: parsed.data.memberId,
      planId: parsed.data.planId,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });

  revalidatePath("/admin/subscriptions");
  return { success: true };
}

export async function renewSubscription(id: string) {
  await requireRole("ADMIN");

  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: { plan: true },
  });
  if (!subscription) {
    return { error: "اشتراک یافت نشد." };
  }

  const base = subscription.endDate > new Date() ? subscription.endDate : new Date();
  const endDate = new Date(base);
  endDate.setDate(endDate.getDate() + subscription.plan.durationDays);

  await prisma.subscription.update({
    where: { id },
    data: { endDate, status: "ACTIVE" },
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/member/subscription");
  return { success: true };
}
