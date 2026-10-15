import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  bleedX?: boolean; // allow full-width hero, etc.
}

/**
 * Responsive layout container used across pages for consistent white space.
 *
 * Max width tuned for editorial layouts, with organic padding that scales
 * across breakpoints.
 */
export const Container: React.FC<ContainerProps> = ({
  as: Tag = "div",
  className,
  children,
  bleedX,
  ...props
}) => {
  const inner = (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl",
        "px-4 sm:px-6 lg:px-10 xl:px-12",
        "py-6 sm:py-8 lg:py-10",
        className,
      )}
    >
      {children}
    </div>
  );

  if (bleedX) {
    return (
      <Tag {...props} className={cn("w-full", props.className)}>
        {inner}
      </Tag>
    );
  }

  return (
    <Tag
      {...props}
      className={cn(
        "w-full bg-[color:var(--nw-page-bg)]",
        "border-t border-[color:var(--nw-border-soft)]/60",
        props.className,
      )}
    >
      {inner}
    </Tag>
  );
};

export default Container;