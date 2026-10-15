import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { palette, shadows, motion as motionTokens } from "@/theme/tokens";

export type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    asChild?: boolean; // reserved if we later wrap other components
  };

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-[12px] border text-sm font-medium tracking-wide px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-150",
  {
    variants: {
      variant: {
        primary:
          "bg-[#A0522D] text-[#FFF8F0] border-transparent hover:bg-[#8F4728] active:bg-[#7A3B20] focus-visible:ring-[#708238] focus-visible:ring-offset-[#FFF8F0]",
        secondary:
          "bg-[#F4E1D2] text-[#1F130F] border-[#E3CBB8] hover:bg-[#EBD1C0] active:bg-[#E0C0AA] focus-visible:ring-[#708238] focus-visible:ring-offset-[#FFF8F0]",
        ghost:
          "bg-transparent text-[#4A3B32] border-transparent hover:bg-[#F4E1D2]/60 active:bg-[#EBD1C0] focus-visible:ring-[#708238] focus-visible:ring-offset-[#FFF8F0]",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant, size, fullWidth, className, disabled, children, ...rest }, ref) => {
    const classes = twMerge(buttonStyles({ variant, size, fullWidth }), className);

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled}
        style={{ boxShadow: disabled ? "none" : shadows.soft }}
        whileHover={
          disabled
            ? undefined
            : {
                scale: 1.05,
                boxShadow: shadows.medium,
                transition: {
                  duration: motionTokens.durations.normal / 1000,
                  ease: motionTokens.easing.standard as any,
                },
              }
        }
        whileTap={
          disabled
            ? undefined
            : {
                scale: 0.95,
                boxShadow: shadows.soft,
                transition: {
                  duration: motionTokens.durations.fast / 1000,
                  ease: motionTokens.easing.standard as any,
                },
              }
        }
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";

export { MotionButton, buttonStyles };