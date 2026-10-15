import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Accessible input with label, helper, and inline error.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { id, label, helperText, error, className, containerClassName, required, ...props },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[color:var(--charcoal,#2B2B2B)] flex items-center gap-1"
          >
            <span>{label}</span>
            {required && (
              <span className="text-xs text-red-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(helperId, errorId)}
          className={cn(
            "w-full rounded-md border bg-[color:var(--ivory,#FAF9F6)] px-3 py-2 text-sm",
            "border-[color:var(--taupe-soft,#D0C7B8)] text-[color:var(--charcoal,#2B2B2B)]",
            "placeholder:text-[color:var(--charcoal-soft,#8A8173)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--teal,#004D40)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ivory,#FAF9F6)]",
            error && "border-red-500",
            className
          )}
          {...props}
        />

        {helperText && !error && (
          <p
            id={helperId}
            className="text-xs text-[color:var(--charcoal-soft,#6F6558)]"
          >
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;