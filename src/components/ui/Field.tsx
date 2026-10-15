import React from "react";
import { twMerge } from "tailwind-merge";

interface FieldRootProps {
  id: string;
  label: string;
  children: React.ReactNode;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const FieldRoot: React.FC<FieldRootProps> = ({
  id,
  label,
  children,
  helperText,
  error,
  required,
  className,
}) => {
  const describedByIds = [
    helperText ? `${id}-helper` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={twMerge("flex flex-col gap-1", className)}>
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-medium text-[#4A3B32] tracking-wide"
      >
        <span>{label}</span>
        {required && (
          <span
            aria-hidden="true"
            className="text-[#C2543C] text-xs align-top"
          >
            *
          </span>
        )}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, {
            id,
            "aria-describedby": describedByIds || undefined,
            "aria-invalid": !!error || undefined,
          })
        : children}
      {helperText && !error && (
        <p
          id={`${id}-helper`}
          className="text-xs text-[#6B5A50] mt-0.5"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-[#C2543C] mt-0.5"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, type = "text", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={twMerge(
          "w-full rounded-[12px] border bg-[#FFF8F0] px-3 py-2 text-sm text-[#1F130F] placeholder:text-[#B19786] outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#708238] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] transition-[border-color,box-shadow,background-color] duration-150",
          hasError
            ? "border-[#C2543C] bg-[#FFF3F0]"
            : "border-[#E3CBB8] hover:border-[#B27A52]",
          className
        )}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, rows = 4, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={twMerge(
          "w-full rounded-[12px] border bg-[#FFF8F0] px-3 py-2 text-sm text-[#1F130F] placeholder:text-[#B19786] outline-none resize-y",
          "focus-visible:ring-2 focus-visible:ring-[#708238] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] transition-[border-color,box-shadow,background-color] duration-150",
          hasError
            ? "border-[#C2543C] bg-[#FFF3F0]"
            : "border-[#E3CBB8] hover:border-[#B27A52]",
          className
        )}
        {...rest}
      />
    );
  }
);

Textarea.displayName = "Textarea";

// Small helper exports to keep API consistent
export const Field = {
  Root: FieldRoot,
  Input,
  Textarea,
};