"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { paymentSchema } from "@/lib/validations/payment";
import type { PaymentStatus } from "@/lib/generated/prisma/client";

export async function getPayments(filters?: {
  search?: string;
  status?: PaymentStatus;
}) {
  await requireRole("ADMIN");

  return prisma.payment.findMany({
    where: {
      status: filters?.status,
      member: filters?.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { phone: { contains: filters.search } },
            ],
          }
        : undefined,
    },
    include: { member: true, subscription: { include: { plan: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyPayments(memberId: string) {
  return prisma.payment.findMany({
    where: { memberId },
    include: { subscription: { include: { plan: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPayment(data: unknown) {
  await requireRole("ADMIN");

  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.payment.create({
    data: {
      memberId: parsed.data.memberId,
      subscriptionId: parsed.data.subscriptionId || null,
      amount: parsed.data.amount,
      status: parsed.data.status,
      paidAt: parsed.data.status === "PAID" ? new Date() : null,
    },
  });

  revalidatePath("/admin/payments");
  return { success: true };
}
