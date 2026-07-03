"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDialogClose } from "@/components/ui/FormDialog";
import { createProgram, updateProgram } from "@/actions/training-programs";
import {
  trainingProgramSchema,
  type TrainingProgramInput,
} from "@/lib/validations/training-program";

type Props = {
  members: { id: string; name: string }[];
  program?: { id: string; memberId: string; title: string; content: string };
};

export function TrainingProgramForm({ members, program }: Props) {
  const isEdit = !!program;
  const closeDialog = useDialogClose();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingProgramInput>({
    resolver: zodResolver(trainingProgramSchema),
    defaultValues: program
      ? {
          memberId: program.memberId,
          title: program.title,
          content: program.content,
        }
      : undefined,
  });

  const onSubmit = (data: TrainingProgramInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateProgram(program.id, data)
        : await createProgram(data);

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
            {member.name}
          </option>
        ))}
      </Select>

      <Input label="عنوان برنامه" {...register("title")} error={errors.title?.message} />

      <Textarea
        label="متن برنامه تمرینی"
        rows={6}
        {...register("content")}
        error={errors.content?.message}
      />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ایجاد برنامه"}
        </Button>
      </div>
    </form>
  );
}
