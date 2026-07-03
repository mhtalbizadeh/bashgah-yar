import { z } from "zod";
import { PaymentStatus } from "@/lib/generated/prisma/enums";

export const paymentSchema = z.object({
  memberId: z.string().min(1, { error: "ورزشکار را انتخاب کنید" }),
  subscriptionId: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().positive({ error: "مبلغ باید بیشتر از صفر باشد" }),
  status: z.enum(PaymentStatus, { error: "وضعیت را انتخاب کنید" }),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
