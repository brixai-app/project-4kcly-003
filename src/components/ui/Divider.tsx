import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

/**
 * Editorial divider for separating sections and drawer content.
 * Uses soft taupe accents from the Nishant Waters design system.
 */
export const Divider: React.FC<DividerProps> = ({ label, className }) => {
  if (!label) {
    return (
      <hr
        className={cn(
          "my-8 border-0 h-px bg-gradient-to-r from-transparent via-[#A89F91]/50 to-transparent",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "my-10 flex items-center text-sm tracking-wide uppercase text-[#A89F91]",
        className
      )}
      role="separator"
      aria-orientation="horizontal"
      aria-label={label}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A89F91]/40 to-transparent" />
      <span className="mx-4 font-[\"Playfair Display\",_serif] text-[0.75rem] tracking-[0.2em]">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A89F91]/40 to-transparent" />
    </div>
  );
};

export default Divider;