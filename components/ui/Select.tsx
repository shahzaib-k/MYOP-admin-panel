import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            "rounded-lg border bg-white px-3 py-2 text-sm text-slate-900",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500",
            error ? "border-red-400" : "border-slate-300",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
