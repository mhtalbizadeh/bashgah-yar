"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { trainingProgramSchema } from "@/lib/validations/training-program";

export async function getAllPrograms() {
  await requireRole("ADMIN");
  return prisma.trainingProgram.findMany({
    include: { coach: true, member: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoachPrograms(coachId: string) {
  return prisma.trainingProgram.findMany({
    where: { coachId },
    include: { member: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemberPrograms(memberId: string) {
  return prisma.trainingProgram.findMany({
    where: { memberId },
    include: { coach: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProgram(data: unknown) {
  const coach = await requireRole("COACH");

  const parsed = trainingProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  await prisma.trainingProgram.create({
    data: {
      coachId: coach.id,
      memberId: parsed.data.memberId,
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  await prisma.notification.create({
    data: {
      userId: parsed.data.memberId,
      title: "برنامه تمرینی جدید",
      message: `برنامه تمرینی «${parsed.data.title}» برای شما ثبت شد.`,
      type: "INFO",
    },
  });

  revalidatePath("/coach/programs");
  revalidatePath("/member/programs");
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function updateProgram(id: string, data: unknown) {
  const coach = await requireRole("COACH");

  const parsed = trainingProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const program = await prisma.trainingProgram.findUnique({ where: { id } });
  if (!program || program.coachId !== coach.id) {
    return { error: "شما اجازه ویرایش این برنامه را ندارید." };
  }

  await prisma.trainingProgram.update({
    where: { id },
    data: {
      memberId: parsed.data.memberId,
      title: parsed.data.title,
      content: parsed.data.content,
    },
  });

  revalidatePath("/coach/programs");
  revalidatePath("/member/programs");
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function deleteProgram(id: string) {
  const coach = await requireRole("COACH");

  const program = await prisma.trainingProgram.findUnique({ where: { id } });
  if (!program || program.coachId !== coach.id) {
    return { error: "شما اجازه حذف این برنامه را ندارید." };
  }

  await prisma.trainingProgram.delete({ where: { id } });

  revalidatePath("/coach/programs");
  revalidatePath("/member/programs");
  revalidatePath("/admin/programs");
}
