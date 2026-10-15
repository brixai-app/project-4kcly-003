import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectProps<T = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption<T>[];
  onChange?: (value: T) => void;
}

export function Select<T = string>({
  label,
  helperText,
  error,
  options,
  value,
  onChange,
  id,
  className,
  disabled,
  ...rest
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectId = id || React.useId();

  const describedByIds = [
    helperText ? `${selectId}-helper` : undefined,
    error ? `${selectId}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as unknown as T;
    onChange?.(val);
  };

  const currentLabel = options.find((o) => String(o.value) === String(value))?.label;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="flex items-center gap-1 text-sm font-medium text-[#4A3B32] tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {/* Native select for accessibility */}
        <select
          id={selectId}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          value={value as any}
          onChange={handleNativeChange}
          aria-describedby={describedByIds || undefined}
          aria-invalid={!!error || undefined}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          {...rest}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value as any}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Styled presentation layer */}
        <button
          type="button"
          className={twMerge(
            "w-full rounded-[12px] border bg-[#FFF8F0] px-3 py-2 text-left text-sm text-[#1F130F] flex items-center justify-between gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#708238] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]",
            disabled
              ? "border-[#E3CBB8] opacity-60 cursor-not-allowed"
              : error
              ? "border-[#C2543C] bg-[#FFF3F0]"
              : "border-[#E3CBB8] hover:border-[#B27A52]",
            className
          )}
          aria-hidden="true"
        >
          <span className={currentLabel ? "" : "text-[#B19786]"}>
            {currentLabel || "Select"}
          </span>
          <AnimatePresence initial={false}>
            <motion.span
              key={isOpen ? "open" : "closed"}
              initial={{ rotate: isOpen ? 0 : 180, opacity: 0 }}
              animate={{ rotate: isOpen ? 180 : 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-[#4A3B32] flex items-center"
            >
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {helperText && !error && (
        <p
          id={`${selectId}-helper`}
          className="text-xs text-[#6B5A50] mt-0.5"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${selectId}-error`}
          className="text-xs text-[#C2543C] mt-0.5"
        >
          {error}
        </p>
      )}
    </div>
  );
}