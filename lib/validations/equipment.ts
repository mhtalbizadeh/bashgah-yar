import { z } from "zod";
import { EquipmentStatus } from "@/lib/generated/prisma/enums";

export const equipmentSchema = z.object({
  name: z.string().min(2, { error: "نام دستگاه را وارد کنید" }),
  purchaseDate: z.string().min(1, { error: "تاریخ خرید را وارد کنید" }),
  status: z.enum(EquipmentStatus, { error: "وضعیت را انتخاب کنید" }),
  description: z.string().optional().or(z.literal("")),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
