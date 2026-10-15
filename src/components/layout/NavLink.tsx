import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Luxury-styled navigation link with active underline, teal hover, and focus ring.
 */
export const NavLink: React.FC<NavLinkProps> = ({ to, children, className, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "relative inline-flex items-center text-sm tracking-wide transition-colors duration-200",
          "text-[#4A4A4A] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]",
          isActive && "text-[#004D40] font-medium",
          className
        )
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined) as any}
    >
      {({ isActive }) => (
        <span className="relative py-1">
          <span className="px-0.5">{children}</span>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] origin-center transform bg-[#004D40] transition-[opacity,transform] duration-200",
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50 group-hover:opacity-100"
            )}
          />
        </span>
      )}
    </RouterNavLink>
  );
};

export default NavLink;