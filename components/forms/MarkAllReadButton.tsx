"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { markAllAsRead } from "@/actions/notifications";

export function MarkAllReadButton() {
  return (
    <ActionButton
      label="علامت‌گذاری همه به عنوان خوانده‌شده"
      pendingLabel="در حال ثبت..."
      action={markAllAsRead}
    />
  );
}
