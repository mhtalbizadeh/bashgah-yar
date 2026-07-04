"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createSubscription } from "@/actions/subscriptions";
import {
  subscriptionSchema,
  type SubscriptionInput,
} from "@/lib/validations/subscription";

type Props = {
  members: { id: string; name: string; phone: string }[];
  plans: { id: string; name: string; durationDays: number }[];
};

export function SubscriptionForm({ members, plans }: Props) {
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      startDate: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = (data: SubscriptionInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createSubscription(data);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select label="ورزشکار" {...register("memberId")} error={errors.memberId?.message}>
        <option value="">انتخاب کنید</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name} ({member.phone})
          </option>
        ))}
      </Select>

      <Select label="پلن عضویت" {...register("planId")} error={errors.planId?.message}>
        <option value="">انتخاب کنید</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name} ({plan.durationDays} روز)
          </option>
        ))}
      </Select>

      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="تاریخ شروع"
            value={field.value}
            onChange={field.onChange}
            error={errors.startDate?.message}
          />
        )}
      />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ثبت..." : "ثبت اشتراک"}
        </Button>
      </div>
    </form>
  );
}
