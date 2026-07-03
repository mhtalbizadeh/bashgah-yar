"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import {
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/actions/subscription-plans";
import {
  subscriptionPlanSchema,
  type SubscriptionPlanInput,
} from "@/lib/validations/subscription-plan";

type SubscriptionPlanFormValues = z.input<typeof subscriptionPlanSchema>;

type Props = {
  plan?: {
    id: string;
    name: string;
    durationDays: number;
    price: number;
    description: string | null;
  };
};

export function SubscriptionPlanForm({ plan }: Props) {
  const isEdit = !!plan;
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionPlanFormValues, unknown, SubscriptionPlanInput>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: plan
      ? {
          name: plan.name,
          durationDays: plan.durationDays,
          price: plan.price,
          description: plan.description ?? "",
        }
      : { durationDays: 30, price: 0 },
  });

  const onSubmit = (data: SubscriptionPlanInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateSubscriptionPlan(plan.id, data)
        : await createSubscriptionPlan(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="نام پلن" {...register("name")} error={errors.name?.message} />
      <Input
        label="مدت اعتبار (روز)"
        type="number"
        {...register("durationDays")}
        error={errors.durationDays?.message}
      />
      <Input
        label="قیمت (تومان)"
        type="number"
        {...register("price")}
        error={errors.price?.message}
      />
      <Textarea
        label="توضیحات"
        rows={3}
        {...register("description")}
        error={errors.description?.message}
      />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن پلن"}
        </Button>
      </div>
    </form>
  );
}
