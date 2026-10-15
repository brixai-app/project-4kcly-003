import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MotionBaseProps {
  children: React.ReactNode;
  className?: string;
}

interface FadeInOnViewProps extends MotionBaseProps {
  delay?: number;
}

export const FadeInOnView: React.FC<FadeInOnViewProps> = ({
  children,
  className,
  delay = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

interface HoverScaleProps extends MotionBaseProps {
  scale?: number;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  className,
  scale = 1.03,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileFocus={{ scale }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {children}
    </motion.div>
  );
};

interface SlideOverMotionProps extends MotionBaseProps {
  isOpen: boolean;
  side?: "right" | "left";
  onAnimationComplete?: () => void;
}

/**
 * Motion wrapper for slide-over drawers (cart, label designer).
 */
export const SlideOverMotion: React.FC<SlideOverMotionProps> = ({
  children,
  className,
  isOpen,
  side = "right",
  onAnimationComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    if (!isOpen) return null;
    return <div className={className}>{children}</div>;
  }

  const fromX = side === "right" ? "100%" : "-100%";

  return (
    <motion.aside
      className={className}
      initial={false}
      animate={{ x: isOpen ? 0 : fromX }}
      transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={onAnimationComplete}
      aria-hidden={!isOpen}
    >
      {children}
    </motion.aside>
  );
};

export default {
  FadeInOnView,
  HoverScale,
  SlideOverMotion,
};