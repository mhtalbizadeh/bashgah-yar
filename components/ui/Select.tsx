import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm text-slate-600">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
            error ? "border-danger" : "border-slate-200"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
