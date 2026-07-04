"use client";

import { useState, useTransition } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getRevenueGrowthAnalytics } from "@/actions/analytics";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatToman } from "@/lib/format";
import { toPersianDigits } from "@/lib/jalali";

type MonthPoint = { label: string; revenue: number; growth: number };
type Analytics = { series: MonthPoint[]; totalRevenue: number; totalGrowth: number };

const RANGES = [
  { value: 6 as const, label: "۶ ماه" },
  { value: 12 as const, label: "۱۲ ماه" },
];

function formatCompactToman(value: number) {
  return toPersianDigits(
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
  );
}

function TooltipCard({
  active,
  payload,
  label,
  color,
  valueFormatter,
  suffix,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  color: string;
  valueFormatter: (value: number) => string;
  suffix: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-slate-900">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {valueFormatter(value)}
        <span className="font-normal text-slate-400">{suffix}</span>
      </p>
    </div>
  );
}

function MiniBarChart({
  data,
  dataKey,
  color,
  tickFormatter,
  tooltipFormatter,
  tooltipSuffix,
}: {
  data: MonthPoint[];
  dataKey: "revenue" | "growth";
  color: string;
  tickFormatter: (value: number) => string;
  tooltipFormatter: (value: number) => string;
  tooltipSuffix: string;
}) {
  const hasData = data.some((point) => point[dataKey] > 0);

  if (!hasData) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400">
        داده‌ای برای این بازه ثبت نشده است.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickFormatter={tickFormatter}
        />
        <Tooltip
          cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
          content={
            <TooltipCard
              color={color}
              valueFormatter={tooltipFormatter}
              suffix={tooltipSuffix}
            />
          }
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueGrowthChart({ initial }: { initial: Analytics }) {
  const [months, setMonths] = useState<6 | 12>(6);
  const [data, setData] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function selectRange(value: 6 | 12) {
    if (value === months) return;
    setMonths(value);
    startTransition(async () => {
      const result = await getRevenueGrowthAnalytics(value);
      setData(result);
    });
  }

  return (
    <Card>
      <CardHeader
        title="نمودار رشد و درآمد"
        description="روند ماهانه درآمد و اعضای جدید باشگاه"
        action={
          <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
            {RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => selectRange(range.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  months === range.value
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        }
      />
      <div
        className={`grid grid-cols-1 gap-6 p-4 transition-opacity duration-200 lg:grid-cols-2 lg:divide-x lg:divide-x-reverse lg:divide-slate-100 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium text-slate-700">درآمد</p>
            <p className="text-sm font-bold text-primary">
              {formatToman(data.totalRevenue)}
            </p>
          </div>
          <MiniBarChart
            data={data.series}
            dataKey="revenue"
            color="var(--color-primary)"
            tickFormatter={formatCompactToman}
            tooltipFormatter={formatToman}
            tooltipSuffix=""
          />
        </div>
        <div className="lg:pr-6">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium text-slate-700">رشد اعضا</p>
            <p className="text-sm font-bold text-secondary">
              {toPersianDigits(data.totalGrowth)} عضو جدید
            </p>
          </div>
          <MiniBarChart
            data={data.series}
            dataKey="growth"
            color="var(--color-secondary)"
            tickFormatter={(value) => toPersianDigits(value)}
            tooltipFormatter={(value) => toPersianDigits(value)}
            tooltipSuffix="عضو"
          />
        </div>
      </div>
    </Card>
  );
}
