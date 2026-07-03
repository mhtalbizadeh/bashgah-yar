import { z } from "zod";
import { Role } from "@/lib/generated/prisma/enums";

export const userSchema = z.object({
  name: z.string().min(2, { error: "نام باید حداقل ۲ حرف باشد" }),
  phone: z
    .string()
    .regex(/^09\d{9}$/, { error: "شماره تماس معتبر نیست (مثال: 09xxxxxxxxx)" }),
  password: z
    .string()
    .refine((value) => value === "" || value.length >= 8, {
      error: "رمز عبور باید حداقل ۸ کاراکتر باشد",
    }),
  role: z.enum(Role, { error: "نقش را انتخاب کنید" }),
});

export const createUserSchema = userSchema.extend({
  password: z
    .string()
    .min(8, { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" }),
});

export type UserInput = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
