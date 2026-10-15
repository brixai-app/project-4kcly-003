import React from "react";
import { motion } from "framer-motion";
import type { LabelDesign } from "./labelDesignModel";

export interface PreviewBottleMockupProps {
  design: LabelDesign;
}

const PreviewBottleMockup: React.FC<PreviewBottleMockupProps> = ({ design }) => {
  const hasElements = design.elements.length > 0;

  return (
    <section
      aria-label="Bottle preview"
      className="flex h-full flex-col gap-3 rounded-2xl bg-gradient-to-br from-olive-900 via-olive-800 to-terracotta-800 px-4 py-3 text-cream-50 shadow-lg shadow-olive-900/40"
    >
      <header className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide">
            Bottle preview
          </h3>
          <p className="mt-0.5 text-xs text-olive-100/80">
            A soft mockup of how your label wraps around a glass bottle.
          </p>
        </div>
        <div className="rounded-full bg-black/20 px-2 py-0.5 text-[11px] text-olive-100/80">
          Live
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <motion.div
          className="relative h-60 w-28 min-w-[7rem] max-w-[7rem]"
          whileHover={{ rotateY: 8, rotateX: -6, translateY: -4 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cream-100/90 via-cream-50/90 to-cream-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)]" />

          <div className="absolute left-1/2 top-1 h-6 w-10 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-neutral-700 via-neutral-900 to-black/90" />

          <div className="absolute inset-y-6 left-1/2 w-16 -translate-x-1/2 rounded-lg bg-gradient-to-r from-black/12 via-transparent to-black/16" />

          <motion.div
            className="absolute inset-y-10 left-1/2 w-16 -translate-x-1/2 overflow-hidden rounded-lg border border-cream-200/80 bg-cream-50/95 shadow-md shadow-olive-900/40"
            initial={{ opacity: 0, scale: 0.95, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 via-black/5 to-transparent" />

            <div className="relative h-full w-full overflow-hidden bg-cream-100/90">
              {hasElements ? (
                <div className="absolute inset-2">
                  {design.elements.map((el) => {
                    const left = `${el.position.x * 100}%`;
                    const top = `${el.position.y * 100}%`;
                    const width = `${el.size.width * 100}%`;
                    const height = `${el.size.height * 100}%`;

                    const depthShift = (el.zIndex || 1) * 0.3;

                    if (el.type === "text") {
                      const textEl: any = el;
                      return (
                        <motion.div
                          key={el.id}
                          className="absolute flex items-center justify-center rounded-md bg-cream-50/80 px-0.5 py-0.5 text-[8px] leading-tight text-neutral-800 shadow-sm shadow-olive-900/20"
                          style={{
                            left,
                            top,
                            width,
                            height,
                            transform: "translate(-50%, -50%)",
                            fontFamily: textEl.fontFamily,
                            color: textEl.color,
                            textAlign: textEl.align,
                          }}
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{
                            opacity: 1,
                            y: depthShift,
                            scale: 1,
                          }}
                          transition={{ duration: 0.26 }}
                        >
                          <span className="line-clamp-3 px-1">
                            {textEl.text}
                          </span>
                        </motion.div>
                      );
                    }

                    const imgEl: any = el;
                    return (
                      <motion.div
                        key={el.id}
                        className="absolute overflow-hidden rounded-md bg-cream-200/80 shadow-sm shadow-olive-900/30"
                        style={{
                          left,
                          top,
                          width,
                          height,
                          transform: "translate(-50%, -50%)",
                        }}
                        initial={{ opacity: 0, y: 4, scale: 0.94 }}
                        animate={{ opacity: 1, y: depthShift, scale: 1 }}
                        transition={{ duration: 0.26 }}
                      >
                        {imgEl.src && (
                          <img
                            src={imgEl.src}
                            alt={imgEl.alt || "Label artwork"}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-[10px] text-olive-900/70">
                  <span className="rounded-full bg-olive-100/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-olive-800">
                    Live mock
                  </span>
                  <p className="text-center">
                    As you add text or logos, your label will appear here wrapped
                    on the bottle.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <p className="text-[11px] leading-relaxed text-olive-100/80">
        This is a visual approximation only. Real print colors and positioning
        may vary slightly. We use this mock to help you feel the composition
        before checkout.
      </p>
    </section>
  );
};

export default PreviewBottleMockup;