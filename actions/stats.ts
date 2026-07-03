"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function getAdminStats() {
  await requireRole("ADMIN");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    memberCount,
    coachCount,
    activeSubscriptionCount,
    monthlyIncome,
    orderCount,
    equipmentCount,
    recentNotifications,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "COACH" } }),
    prisma.subscription.count({
      where: { status: "ACTIVE", endDate: { gte: now } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
    }),
    prisma.order.count(),
    prisma.equipment.count(),
    prisma.notification.findMany({
      where: { user: { role: "ADMIN" } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    memberCount,
    coachCount,
    activeSubscriptionCount,
    monthlyIncome: monthlyIncome._sum.amount ?? 0,
    orderCount,
    equipmentCount,
    recentNotifications,
  };
}

export async function getCoachStats(coachId: string) {
  const now = new Date();

  const [memberIds, recentPrograms, currentSalary, recentNotifications] =
    await Promise.all([
      prisma.trainingProgram.findMany({
        where: { coachId },
        select: { memberId: true },
        distinct: ["memberId"],
      }),
      prisma.trainingProgram.findMany({
        where: { coachId },
        include: { member: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.salary.findFirst({
        where: { coachId, month: now.getMonth() + 1, year: now.getFullYear() },
      }),
      prisma.notification.findMany({
        where: { userId: coachId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    memberCount: memberIds.length,
    recentPrograms,
    currentSalary,
    recentNotifications,
  };
}

export async function getMemberStats(memberId: string) {
  const [subscription, latestProgram, recentOrders, recentNotifications] =
    await Promise.all([
      prisma.subscription.findFirst({
        where: { memberId },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.trainingProgram.findFirst({
        where: { memberId },
        include: { coach: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        where: { memberId },
        include: { product: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId: memberId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return { subscription, latestProgram, recentOrders, recentNotifications };
}
