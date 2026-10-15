import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Accessible textarea with label, helper, and error.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { id, label, helperText, error, className, containerClassName, required, rows = 4, ...props },
    ref
  ) => {
    const textareaId = id || React.useId();
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(helperId, errorId)}
          className={cn(
            "w-full rounded-md border bg-[color:var(--ivory,#FAF9F6)] px-3 py-2 text-sm resize-y min-h-[120px]",
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

Textarea.displayName = "Textarea";

export default Textarea;