"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md";

const DialogCloseContext = createContext<() => void>(() => {});

export function useDialogClose() {
  return useContext(DialogCloseContext);
}

export function FormDialog({
  title,
  triggerLabel,
  triggerIcon,
  triggerVariant = "primary",
  triggerSize = "md",
  iconOnly = false,
  children,
}: {
  title: string;
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerVariant?: Variant;
  triggerSize?: Size;
  iconOnly?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {iconOnly ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={triggerLabel}
          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-primary"
        >
          {triggerIcon}
        </button>
      ) : (
        <Button variant={triggerVariant} size={triggerSize} onClick={() => setOpen(true)}>
          {triggerIcon}
          {triggerLabel}
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <DialogCloseContext.Provider value={() => setOpen(false)}>
          {children}
        </DialogCloseContext.Provider>
      </Modal>
    </>
  );
}
