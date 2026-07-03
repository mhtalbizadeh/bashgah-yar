import { z } from "zod";
import { SalaryStatus } from "@/lib/generated/prisma/enums";

export const salarySchema = z.object({
  coachId: z.string().min(1, { error: "مربی را انتخاب کنید" }),
  amount: z.coerce.number().positive({ error: "مبلغ باید بیشتر از صفر باشد" }),
  month: z.coerce.number().int().min(1).max(12, { error: "ماه معتبر نیست" }),
  year: z.coerce.number().int().min(1400, { error: "سال معتبر نیست" }),
  status: z.enum(SalaryStatus, { error: "وضعیت را انتخاب کنید" }),
});

export type SalaryInput = z.infer<typeof salarySchema>;
