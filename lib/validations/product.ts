import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { error: "نام محصول را وارد کنید" }),
  description: z.string().optional().or(z.literal("")),
  price: z.coerce.number().nonnegative({ error: "قیمت نمی‌تواند منفی باشد" }),
  stock: z.coerce.number().int().nonnegative({ error: "موجودی نمی‌تواند منفی باشد" }),
});

export type ProductInput = z.infer<typeof productSchema>;
