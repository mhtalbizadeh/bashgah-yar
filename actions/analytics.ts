"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { gregorianToJalali, jalaliMonthNames, jalaliToGregorian, todayJalali } from "@/lib/jalali";

function lastJalaliMonths(count: number) {
  const today = todayJalali();
  let jy = today.jy;
  let jm = today.jm;
  const months: { key: number; jy: number; jm: number }[] = [];

  for (let i = 0; i < count; i++) {
    months.unshift({ key: jy * 12 + (jm - 1), jy, jm });
    jm -= 1;
    if (jm === 0) {
      jm = 12;
      jy -= 1;
    }
  }

  return months;
}

function jalaliMonthKey(date: Date) {
  const { jy, jm } = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return jy * 12 + (jm - 1);
}

export async function getRevenueGrowthAnalytics(months: 6 | 12 = 6) {
  await requireRole("ADMIN");

  const buckets = lastJalaliMonths(months);
  const { gy, gm, gd } = jalaliToGregorian(buckets[0].jy, buckets[0].jm, 1);
  const rangeStart = new Date(gy, gm - 1, gd);

  const [payments, members] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "PAID", paidAt: { gte: rangeStart } },
      select: { amount: true, paidAt: true },
    }),
    prisma.user.findMany({
      where: { role: "MEMBER", createdAt: { gte: rangeStart } },
      select: { createdAt: true },
    }),
  ]);

  const indexByKey = new Map(buckets.map((b, i) => [b.key, i]));
  const series = buckets.map((b) => ({
    label: jalaliMonthNames[b.jm - 1],
    revenue: 0,
    growth: 0,
  }));

  for (const payment of payments) {
    if (!payment.paidAt) continue;
    const idx = indexByKey.get(jalaliMonthKey(payment.paidAt));
    if (idx !== undefined) series[idx].revenue += payment.amount;
  }

  for (const member of members) {
    const idx = indexByKey.get(jalaliMonthKey(member.createdAt));
    if (idx !== undefined) series[idx].growth += 1;
  }

  const totalRevenue = series.reduce((sum, m) => sum + m.revenue, 0);
  const totalGrowth = series.reduce((sum, m) => sum + m.growth, 0);

  return { series, totalRevenue, totalGrowth };
}

export async function getEquipmentStatusOverview() {
  await requireRole("ADMIN");

  return prisma.equipment.findMany({
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
}
