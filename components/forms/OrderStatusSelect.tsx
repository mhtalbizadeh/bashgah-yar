"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/Select";
import { updateOrderStatus } from "@/actions/orders";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

const statusLabel: Record<string, string> = {
  PENDING: "در انتظار",
  READY: "آماده تحویل",
  DELIVERED: "تحویل شده",
};

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => {
        const value = event.target.value;
        startTransition(async () => {
          await updateOrderStatus(orderId, { status: value });
        });
      }}
    >
      {Object.entries(statusLabel).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
