import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import type { Equipment, EquipmentStatus } from "@/lib/generated/prisma/client";

const statusLabel: Record<EquipmentStatus, string> = {
  ACTIVE: "فعال",
  NEEDS_REPAIR: "نیازمند تعمیر",
  BROKEN: "خراب",
};

const statusTone: Record<EquipmentStatus, "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  NEEDS_REPAIR: "warning",
  BROKEN: "danger",
};

const statusIcon: Record<EquipmentStatus, IconType> = {
  ACTIVE: FiCheckCircle,
  NEEDS_REPAIR: FiAlertTriangle,
  BROKEN: FiXCircle,
};

const statusIconClasses: Record<EquipmentStatus, string> = {
  ACTIVE: "bg-emerald-50 text-secondary",
  NEEDS_REPAIR: "bg-amber-50 text-warning",
  BROKEN: "bg-red-50 text-danger",
};

export function EquipmentStatusPanel({ equipment }: { equipment: Equipment[] }) {
  return (
    <Card>
      <CardHeader
        title="آخرین وضعیت تجهیزات"
        description="به‌روزترین وضعیت ثبت‌شده دستگاه‌ها"
      />
      <div className="divide-y divide-slate-100">
        {equipment.length === 0 && (
          <p className="p-4 text-sm text-slate-400">دستگاهی ثبت نشده است.</p>
        )}
        {equipment.map((item) => {
          const Icon = statusIcon[item.status];
          return (
            <div key={item.id} className="flex items-center gap-3 p-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${statusIconClasses[item.status]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">
                  آخرین به‌روزرسانی: {formatDate(item.updatedAt)}
                </p>
              </div>
              <Badge tone={statusTone[item.status]}>{statusLabel[item.status]}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
