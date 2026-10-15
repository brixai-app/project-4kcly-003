import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LoadingSpinnerProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

/**
 * Elegant, accessible loading spinner used for simulated async states.
 * Uses a deep teal accent with subtle motion to match the Nishant Waters
 * luxury aesthetic.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading",
  className,
  size = "md",
}) => {
  const spinnerId = React.useId();

  return (
    <div
      className={cn("flex items-center gap-3 text-[#2B2B2B]", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-labelledby={spinnerId}
    >
      <motion.span
        className={cn(
          "inline-block rounded-full border-t-transparent border-r-transparent border-[#004D40]",
          sizeMap[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      {label && (
        <span
          id={spinnerId}
          className="text-sm font-medium tracking-wide" 
          style={{ fontFamily: "Lora, serif" }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;