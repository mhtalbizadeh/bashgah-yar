import type { IconType } from "react-icons";

type Tone = "primary" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  primary: "bg-blue-50 text-primary",
  success: "bg-emerald-50 text-secondary",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: IconType;
  tone?: Tone;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
