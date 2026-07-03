import type { ReactNode } from "react";

type Tone = "primary" | "success" | "warning" | "danger" | "neutral";

const toneClasses: Record<Tone, string> = {
  primary: "bg-blue-50 text-primary",
  success: "bg-emerald-50 text-secondary",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
  neutral: "bg-slate-100 text-slate-500",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
