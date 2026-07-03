import { z } from "zod";

export const subscriptionSchema = z.object({
  memberId: z.string().min(1, { error: "ورزشکار را انتخاب کنید" }),
  planId: z.string().min(1, { error: "پلن عضویت را انتخاب کنید" }),
  startDate: z.string().min(1, { error: "تاریخ شروع را وارد کنید" }),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
