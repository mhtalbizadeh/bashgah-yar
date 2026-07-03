import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm text-slate-600">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
            error ? "border-danger" : "border-slate-200"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
