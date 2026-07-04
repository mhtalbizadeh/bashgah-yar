import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import type { IconType } from "react-icons";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

const config: Record<NotificationType, { icon: IconType; className: string }> = {
  INFO: { icon: FiInfo, className: "bg-blue-50 text-primary" },
  SUCCESS: { icon: FiCheckCircle, className: "bg-emerald-50 text-secondary" },
  WARNING: { icon: FiAlertTriangle, className: "bg-amber-50 text-warning" },
  ERROR: { icon: FiXCircle, className: "bg-red-50 text-danger" },
};

export function NotificationIcon({ type }: { type: NotificationType }) {
  const { icon: Icon, className } = config[type];
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${className}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}
