import { z } from "zod";
import { OrderStatus } from "@/lib/generated/prisma/enums";

export const orderSchema = z.object({
  productId: z.string().min(1, { error: "محصول را انتخاب کنید" }),
});

export const orderStatusSchema = z.object({
  status: z.enum(OrderStatus, { error: "وضعیت را انتخاب کنید" }),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
