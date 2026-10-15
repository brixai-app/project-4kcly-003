import React from "react";
import { cn } from "@/lib/utils";

export interface AccessibleIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string; // required for icon-only buttons
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled" | "subtle";
}

const sizeClasses: Record<NonNullable<AccessibleIconButtonProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-10 w-10 text-base",
};

const variantClasses: Record<NonNullable<AccessibleIconButtonProps["variant"]>, string> = {
  ghost:
    "bg-transparent text-[color:var(--nw-ink-soft)] hover:bg-[color:var(--nw-sand-soft)]/60 focus-visible:bg-[color:var(--nw-sand-soft)]/80",
  filled:
    "bg-[color:var(--nw-terracotta-deep)] text-[color:var(--nw-cream)] hover:bg-[color:var(--nw-terracotta-deep)]/90 focus-visible:bg-[color:var(--nw-terracotta-deep)]/95",
  subtle:
    "bg-[color:var(--nw-cream-soft)] text-[color:var(--nw-ink-strong)] hover:bg-[color:var(--nw-cream)] focus-visible:bg-[color:var(--nw-cream)]",
};

export const AccessibleIconButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleIconButtonProps
>(function AccessibleIconButton(
  { size = "md", variant = "ghost", className, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-transparent",
        "transition-colors duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nw-page-bg)] focus-visible:ring-[color:var(--nw-olive-soft)]",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </button>
  );
});

export default AccessibleIconButton;