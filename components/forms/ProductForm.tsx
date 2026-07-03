"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createProduct, updateProduct } from "@/actions/products";
import { productSchema, type ProductInput } from "@/lib/validations/product";

type ProductFormValues = z.input<typeof productSchema>;

type Props = {
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
  };
};

export function ProductForm({ product }: Props) {
  const isEdit = !!product;
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
        }
      : { price: 0, stock: 0 },
  });

  const onSubmit = (data: ProductInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="نام محصول" {...register("name")} error={errors.name?.message} />
      <Textarea
        label="توضیحات"
        rows={3}
        {...register("description")}
        error={errors.description?.message}
      />
      <Input
        label="قیمت (تومان)"
        type="number"
        {...register("price")}
        error={errors.price?.message}
      />
      <Input
        label="موجودی"
        type="number"
        {...register("stock")}
        error={errors.stock?.message}
      />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن محصول"}
        </Button>
      </div>
    </form>
  );
}
