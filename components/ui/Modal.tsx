"use client";

import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="بستن"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
