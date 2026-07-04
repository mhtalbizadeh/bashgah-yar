"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { orderSchema, orderStatusSchema } from "@/lib/validations/order";

export async function getOrders() {
  await requireRole("ADMIN");
  return prisma.order.findMany({
    include: { member: true, product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyOrders(memberId: string) {
  return prisma.order.findMany({
    where: { memberId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrder(data: unknown) {
  const member = await requireRole("MEMBER");

  const parsed = orderSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "اطلاعات وارد شده معتبر نیست." };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
  });
  if (!product || product.stock < 1) {
    return { error: "این محصول در حال حاضر موجود نیست." };
  }

  await prisma.$transaction([
    prisma.order.create({
      data: { memberId: member.id, productId: product.id },
    }),
    prisma.product.update({
      where: { id: product.id },
      data: { stock: { decrement: 1 } },
    }),
  ]);

  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      title: "سفارش جدید",
      message: `سفارش جدیدی برای «${product.name}» ثبت شد.`,
      type: "INFO",
    })),
  });

  revalidatePath("/member/orders");
  revalidatePath("/member/products");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderStatus(id: string, data: unknown) {
  await requireRole("ADMIN");

  const parsed = orderStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "وضعیت نامعتبر است." };
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { product: true },
  });

  if (parsed.data.status === "READY") {
    await prisma.notification.create({
      data: {
        userId: order.memberId,
        title: "سفارش آماده تحویل",
        message: `سفارش «${order.product.name}» آماده تحویل است.`,
        type: "SUCCESS",
      },
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/member/orders");
  return { success: true };
}
