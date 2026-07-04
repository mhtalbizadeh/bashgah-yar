"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createEquipment, updateEquipment } from "@/actions/equipment";
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/equipment";

const statusLabel: Record<string, string> = {
  ACTIVE: "فعال",
  NEEDS_REPAIR: "نیازمند تعمیر",
  BROKEN: "خراب",
};

type Props = {
  equipment?: {
    id: string;
    name: string;
    purchaseDate: Date | string;
    status: string;
    description: string | null;
  };
};

export function EquipmentForm({ equipment }: Props) {
  const isEdit = !!equipment;
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment
      ? {
          name: equipment.name,
          purchaseDate: new Date(equipment.purchaseDate).toISOString().slice(0, 10),
          status: equipment.status as EquipmentInput["status"],
          description: equipment.description ?? "",
        }
      : { status: "ACTIVE" },
  });

  const onSubmit = (data: EquipmentInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateEquipment(equipment.id, data)
        : await createEquipment(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="نام دستگاه" {...register("name")} error={errors.name?.message} />
      <Controller
        name="purchaseDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="تاریخ خرید"
            value={field.value}
            onChange={field.onChange}
            error={errors.purchaseDate?.message}
          />
        )}
      />
      <Select label="وضعیت" {...register("status")} error={errors.status?.message}>
        {Object.entries(statusLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Textarea
        label="توضیحات"
        rows={3}
        {...register("description")}
        error={errors.description?.message}
      />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن دستگاه"}
        </Button>
      </div>
    </form>
  );
}
