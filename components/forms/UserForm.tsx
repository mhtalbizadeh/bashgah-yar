"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createUser, updateUser } from "@/actions/users";
import {
  createUserSchema,
  userSchema,
  type UserInput,
  type CreateUserInput,
} from "@/lib/validations/user";

const roleLabel: Record<string, string> = {
  ADMIN: "مدیر",
  COACH: "مربی",
  MEMBER: "ورزشکار",
};

type Props = {
  user?: { id: string; name: string; phone: string; role: string };
};

export function UserForm({ user }: Props) {
  const isEdit = !!user;
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(isEdit ? userSchema : createUserSchema),
    defaultValues: user
      ? { name: user.name, phone: user.phone, role: user.role as UserInput["role"], password: "" }
      : { role: "MEMBER" },
  });

  const onSubmit = (data: CreateUserInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateUser(user.id, data)
        : await createUser(data);

      if (result?.error) {
        setServerError(result.error);
        return;
      }
      closeDialog();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="نام و نام خانوادگی" {...register("name")} error={errors.name?.message} />
      <Input
        label="شماره تماس"
        dir="ltr"
        placeholder="09xxxxxxxxx"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <Input
        label={isEdit ? "رمز عبور جدید (اختیاری)" : "رمز عبور"}
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Select label="نقش" {...register("role")} error={errors.role?.message}>
        {Object.entries(roleLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن کاربر"}
        </Button>
      </div>
    </form>
  );
}
