import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-medium px-3 py-1 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral:
          "bg-[color:var(--ivory,#FAF9F6)] text-[color:var(--charcoal,#2B2B2B)] border-[color:var(--taupe-soft,#D0C7B8)]",
        accent:
          "bg-[color:var(--teal,#004D40)] text-[color:var(--ivory,#FAF9F6)] border-[color:var(--teal,#004D40)]",
        outline:
          "bg-transparent text-[color:var(--charcoal,#2B2B2B)] border-[color:var(--charcoal,#2B2B2B)]",
        subtle:
          "bg-[color:var(--taupe-light,#E5DED2)] text-[color:var(--charcoal,#2B2B2B)] border-transparent",
      },
      tone: {
        solid: "",
        muted: "opacity-80",
      },
    },
    defaultVariants: {
      variant: "neutral",
      tone: "solid",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

/**
 * Small pill-style badge, used for sizes, stock or filters.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, tone, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, tone }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;