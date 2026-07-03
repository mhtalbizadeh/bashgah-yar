"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createPayment } from "@/actions/payments";
import { paymentSchema, type PaymentInput } from "@/lib/validations/payment";

type PaymentFormValues = z.input<typeof paymentSchema>;

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  PAID: "پرداخت‌شده",
  FAILED: "ناموفق",
};

type Props = {
  members: { id: string; name: string; phone: string }[];
  subscriptions: { id: string; memberId: string; plan: { name: string } }[];
};

export function PaymentForm({ members, subscriptions }: Props) {
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues, unknown, PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { status: "PAID" },
  });

  const selectedMemberId = watch("memberId");
  const memberSubscriptions = subscriptions.filter(
    (subscription) => subscription.memberId === selectedMemberId
  );

  const onSubmit = (data: PaymentInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createPayment(data);
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

      <Select label="اشتراک مرتبط (اختیاری)" {...register("subscriptionId")}>
        <option value="">بدون اشتراک مشخص</option>
        {memberSubscriptions.map((subscription) => (
          <option key={subscription.id} value={subscription.id}>
            {subscription.plan.name}
          </option>
        ))}
      </Select>

      <Input
        label="مبلغ (تومان)"
        type="number"
        {...register("amount")}
        error={errors.amount?.message}
      />

      <Select label="وضعیت" {...register("status")} error={errors.status?.message}>
        {Object.entries(statusLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ثبت..." : "ثبت پرداخت"}
        </Button>
      </div>
    </form>
  );
}
