import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full",
    "text-sm font-medium tracking-wide",
    "transition-colors duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-[color:var(--teal,#004D40)] focus-visible:ring-offset-[color:var(--ivory,#FAF9F6)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--teal,#004D40)] text-[color:var(--ivory,#FAF9F6)] hover:bg-[#00695C]",
        secondary:
          "bg-[color:var(--taupe-light,#E5DED2)] text-[color:var(--charcoal,#2B2B2B)] hover:bg-[#D1C4B1]",
        ghost:
          "bg-transparent text-[color:var(--charcoal,#2B2B2B)] hover:bg-[color:var(--ivory-soft,#F0ECE4)]",
        outline:
          "bg-transparent border border-[color:var(--charcoal,#2B2B2B)] text-[color:var(--charcoal,#2B2B2B)] hover:bg-[color:var(--ivory-soft,#F0ECE4)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-10 px-6",
        lg: "h-11 px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Design-system button used across the app.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, leftIcon, rightIcon, children, type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {leftIcon && (
          <span className="mr-2 inline-flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {rightIcon && (
          <span className="ml-2 inline-flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };

export default Button;