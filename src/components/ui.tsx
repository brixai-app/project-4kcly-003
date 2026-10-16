import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { DESIGN_COLORS } from '@/mock';

// Utility to combine classes consistently
export function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(classes.filter(Boolean).join(' '));
}

// Motion button with hover/tap micro-animations
export type MotionButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface MotionButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: MotionButtonVariant;
  asChild?: boolean;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  className,
  variant = 'primary',
  disabled,
  children,
  asChild,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors border border-transparent';

  const variants: Record<NonNullable<MotionButtonProps['variant']>, string> = {
    primary: `bg-[${DESIGN_COLORS.coral}] text-white hover:bg-[#ff5c4b] focus-visible:ring-[${DESIGN_COLORS.coral}]`,
    secondary: `bg-[${DESIGN_COLORS.teal}] text-[#FAF9F6] hover:bg-[#0b3b45] focus-visible:ring-[${DESIGN_COLORS.teal}]`,
    ghost:
      'bg-transparent text-slate-800 hover:bg-slate-100 border-slate-200 focus-visible:ring-slate-300',
  } as const;

  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: !disabled ? { scale: 1.03, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' } : undefined,
    whileTap: !disabled ? { scale: 0.97 } : undefined,
    disabled,
    className: cn(
      base,
      variants[variant],
      disabled && 'opacity-60 cursor-not-allowed shadow-none hover:bg-inherit',
      className,
    ),
    ...rest,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ...motionProps,
    });
  }

  return (
    <motion.button {...motionProps}>
      {children}
    </motion.button>
  );
};

// Input field with label, helper, error, and focus/error states
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  helperText,
  error,
  className,
  ...rest
}) => {
  const inputId = id ?? `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const describedBy = error
    ? `${inputId}-error`
    : helperText
    ? `${inputId}-helper`
    : undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-800 font-['Poppins']"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'block w-full rounded-xl border bg-[#FAF9F6] px-3 py-2 text-sm text-slate-900 shadow-sm',
          'focus:border-[#0E4D5B] focus:ring-2 focus:ring-[#0E4D5B]/70 focus:outline-none',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-400/70',
          className,
        )}
        {...rest}
      />
      {helperText && !error && (
        <p
          id={describedBy}
          className="text-xs text-slate-500 font-['Merriweather']"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-red-500 font-['Merriweather']"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible dropdown using native select
interface AccessibleDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  helperText?: string;
  error?: string;
}

export const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className,
  ...rest
}) => {
  const selectId = id ?? `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const describedBy = error
    ? `${selectId}-error`
    : helperText
    ? `${selectId}-helper`
    : undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-800 font-['Poppins']"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'block w-full appearance-none rounded-xl border bg-[#FAF9F6] px-3 py-2 text-sm text-slate-900 shadow-sm',
            'focus:border-[#0E4D5B] focus:ring-2 focus:ring-[#0E4D5B]/70 focus:outline-none',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-400/70',
            className,
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 text-xs">
          ▼
        </span>
      </div>
      {helperText && !error && (
        <p
          id={describedBy}
          className="text-xs text-slate-500 font-['Merriweather']"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${selectId}-error`}
          className="text-xs text-red-500 font-['Merriweather']"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Loader spinner
export const LoaderSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center', className)}>
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0E4D5B]/20 border-t-[#0E4D5B]" />
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-[#7A9E7E]/15 px-3 py-1 text-xs font-medium text-[#0E4D5B] font-['Merriweather']",
      className,
    )}
  >
    {children}
  </span>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div
    className={cn(
      'rounded-3xl bg-[#FAF9F6] shadow-[0_18px_45px_rgba(15,23,42,0.18)] border border-white/60',
      'backdrop-blur-sm',
      className,
    )}
  >
    {children}
  </div>
);

export const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}> = ({ children, className, subtle }) => (
  <section
    className={cn(
      'w-full px-4 py-10 sm:px-8 lg:px-12',
      subtle
        ? 'bg-[#FAF9F6]'
        : 'bg-gradient-to-br from-[#FAF9F6] via-[#FFF1E6] to-[#D9CBB6]/80',
      className,
    )}
  >
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);

export const H1: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h1
    className={cn(
      "text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 font-['Poppins']",
      className,
    )}
  >
    {children}
  </h1>
);

export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h2
    className={cn(
      "text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-['Poppins']",
      className,
    )}
  >
    {children}
  </h2>
);

export const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p
    className={cn(
      "text-sm sm:text-base leading-relaxed text-slate-700 font-['Merriweather']",
      className,
    )}
  >
    {children}
  </p>
);