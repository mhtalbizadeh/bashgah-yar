"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";

export function ActionButton({
  action,
  label,
  pendingLabel,
  variant = "outline",
}: {
  action: () => Promise<unknown>;
  label: string;
  pendingLabel?: string;
  variant?: Variant;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await action();
        })
      }
    >
      {isPending ? pendingLabel ?? "در حال انجام..." : label}
    </Button>
  );
}
