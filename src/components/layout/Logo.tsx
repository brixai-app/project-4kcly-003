import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

/**
 * Brand logo for Nishant Waters.
 * Playfair Display for primary wordmark with Bodoni accent.
 */
export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-baseline gap-1 text-[#2B2B2B] no-underline outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]",
        className
      )}
      aria-label="Nishant Waters home"
    >
      <span className="font-[\"Playfair Display\",_serif] text-xl tracking-[0.14em] uppercase">
        Nishant
      </span>
      <span className="font-[\"Bodoni Moda\",_serif] text-xl tracking-[0.2em] uppercase text-[#004D40]">
        Waters
      </span>
    </Link>
  );
};

export default Logo;