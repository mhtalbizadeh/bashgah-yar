import { z } from "zod";

export const trainingProgramSchema = z.object({
  memberId: z.string().min(1, { error: "ورزشکار را انتخاب کنید" }),
  title: z.string().min(2, { error: "عنوان برنامه را وارد کنید" }),
  content: z.string().min(5, { error: "متن برنامه را وارد کنید" }),
});

export type TrainingProgramInput = z.infer<typeof trainingProgramSchema>;
