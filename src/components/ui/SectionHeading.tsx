import React from "react";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
};

/**
 * Luxury editorial heading using Playfair for main heading
 * and Bodoni style overline/subtitle (via font-bodoni class).
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  overline,
  title,
  subtitle,
  align = "left",
  className,
}) => {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <header
      className={cn(
        "flex flex-col gap-2 mb-8", // spacing token
        alignment,
        className
      )}
    >
      {overline && (
        <p
          className={cn(
            "text-xs tracking-[0.2em] uppercase text-[color:var(--taupe-soft, #A89F91)]",
            "font-bodoni"
          )}
        >
          {overline}
        </p>
      )}

      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl text-[color:var(--charcoal, #2B2B2B)]",
          "font-playfair leading-tight"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-sm sm:text-base text-[color:var(--charcoal-soft,#555)]",
            "font-bodoni"
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
};

export default SectionHeading;