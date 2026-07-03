"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createSalary, updateSalary } from "@/actions/salaries";
import { salarySchema, type SalaryInput } from "@/lib/validations/salary";

type SalaryFormValues = z.input<typeof salarySchema>;

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
};

type Props = {
  coaches: { id: string; name: string }[];
  salary?: {
    id: string;
    coachId: string;
    amount: number;
    month: number;
    year: number;
    status: string;
  };
};

export function SalaryForm({ coaches, salary }: Props) {
  const isEdit = !!salary;
  const closeDialog = useDialogClose();
  const now = new Date();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryFormValues, unknown, SalaryInput>({
    resolver: zodResolver(salarySchema),
    defaultValues: salary
      ? {
          coachId: salary.coachId,
          amount: salary.amount,
          month: salary.month,
          year: salary.year,
          status: salary.status as SalaryInput["status"],
        }
      : {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          status: "PENDING",
        },
  });

  const onSubmit = (data: SalaryInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateSalary(salary.id, data)
        : await createSalary(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Select label="مربی" {...register("coachId")} error={errors.coachId?.message}>
        <option value="">انتخاب کنید</option>
        {coaches.map((coach) => (
          <option key={coach.id} value={coach.id}>
            {coach.name}
          </option>
        ))}
      </Select>

      <Input
        label="مبلغ (تومان)"
        type="number"
        {...register("amount")}
        error={errors.amount?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ماه"
          type="number"
          min={1}
          max={12}
          {...register("month")}
          error={errors.month?.message}
        />
        <Input
          label="سال"
          type="number"
          {...register("year")}
          error={errors.year?.message}
        />
      </div>

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
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ثبت حقوق"}
        </Button>
      </div>
    </form>
  );
}
