"use client";

import { useState, useTransition } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDeleteButton({
  action,
  itemLabel,
}: {
  action: () => Promise<unknown>;
  itemLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await action();
      setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="حذف"
        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-danger"
      >
        <FiTrash2 className="h-4 w-4" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="تایید حذف">
        <p className="text-sm text-slate-600">
          آیا از حذف «{itemLabel}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            انصراف
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
