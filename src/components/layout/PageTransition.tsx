import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps routed pages to provide a soft fade/slide transition.
 * Respects the user's reduced-motion preference.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const baseVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        initial: { opacity: 0, y: 12 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.18, 0.75, 0.25, 1],
          },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      };

  return (
    <div className="relative flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          variants={baseVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-[60vh]"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;