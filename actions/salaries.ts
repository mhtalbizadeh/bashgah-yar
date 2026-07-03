"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { salarySchema } from "@/lib/validations/salary";

export async function getSalaries() {
  await requireRole("ADMIN");
  return prisma.salary.findMany({
    include: { coach: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function getMySalaries(coachId: string) {
  return prisma.salary.findMany({
    where: { coachId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function createSalary(data: unknown) {
  await requireRole("ADMIN");

  const parsed = salarySchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.salary.create({
    data: {
      ...parsed.data,
      paymentDate: parsed.data.status === "PAID" ? new Date() : null,
    },
  });

  revalidatePath("/admin/salaries");
  revalidatePath("/coach/salary");
  return { success: true };
}

export async function updateSalary(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = salarySchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const existing = await prisma.salary.findUnique({ where: { id } });

  await prisma.salary.update({
    where: { id },
    data: {
      ...parsed.data,
      paymentDate:
        parsed.data.status === "PAID"
          ? existing?.paymentDate ?? new Date()
          : null,
    },
  });

  revalidatePath("/admin/salaries");
  revalidatePath("/coach/salary");
  return { success: true };
}
