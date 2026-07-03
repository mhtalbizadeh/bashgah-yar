import { z } from "zod";

export const subscriptionPlanSchema = z.object({
  name: z.string().min(2, { error: "نام پلن را وارد کنید" }),
  durationDays: z.coerce
    .number()
    .int()
    .positive({ error: "مدت اعتبار باید عددی مثبت باشد" }),
  price: z.coerce.number().nonnegative({ error: "قیمت نمی‌تواند منفی باشد" }),
  description: z.string().optional().or(z.literal("")),
});

export type SubscriptionPlanInput = z.infer<typeof subscriptionPlanSchema>;
