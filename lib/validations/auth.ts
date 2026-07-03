import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{9}$/, { error: "شماره تماس معتبر نیست (مثال: 09xxxxxxxxx)" }),
  password: z.string().min(8, { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" }),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
