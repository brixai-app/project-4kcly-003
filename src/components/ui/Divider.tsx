import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
  label?: string;
}

/**
 * Textured divider inspired by warm sand / olive tones.
 * Uses layered gradients + subtle noise-like effect via box-shadow.
 */
export const Divider: React.FC<DividerProps> = ({ className, label }) => {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden={!label}>
      <span
        className={"flex-1 h-px bg-gradient-to-r from-[rgba(160,82,45,0.15)] via-[rgba(112,130,56,0.25)] to-[rgba(244,225,210,0.4)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.02)] rounded-full"}
      />
      {label && (
        <span className="text-xs tracking-[0.14em] uppercase text-[color:var(--nw-ink-muted)]">
          {label}
        </span>
      )}
      {label && (
        <span
          className={"flex-1 h-px bg-gradient-to-l from-[rgba(160,82,45,0.15)] via-[rgba(112,130,56,0.25)] to-[rgba(244,225,210,0.4)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.02)] rounded-full"}
        />
      )}
    </div>
  );
};

export default Divider;