"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";

export async function getMyNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function markAsRead(id: string) {
  const user = await requireUser();

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== user.id) {
    return { error: "دسترسی مجاز نیست." };
  }

  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/notifications");
  revalidatePath("/coach/notifications");
  revalidatePath("/member/notifications");
}

export async function markAllAsRead() {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/admin/notifications");
  revalidatePath("/coach/notifications");
  revalidatePath("/member/notifications");
}
