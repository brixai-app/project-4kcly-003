import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { BRANDY_PALETTE, LabelColorOption } from "@/mock";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";

export interface LabelCustomizerProps {
  /** Currently selected label color id (LabelColorOption.id) */
  value: string | null;
  /** Available color options for this product */
  availableColors: LabelColorOption[];
  /** Called when the user selects a different color */
  onChange: (labelColorId: string) => void;
  /** Optional aria-label prefix, useful when multiple customizers exist */
  ariaLabelPrefix?: string;
}

/**
 * NOTE: This component is 100% frontend-only and relies on mock
 * data and types from src/mock.ts. There is NO backend involved.
 */

const bottleBaseGradient = `linear-gradient(to bottom, ${BRANDY_PALETTE.cream} 0%, #ffffff 45%, #e5e7eb 70%, ${BRANDY_PALETTE.creamSoft} 100%)`;

const bandShadow = "0 8px 24px rgba(0,0,0,0.18)";

const colorTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
};

const LabelCustomizer: React.FC<LabelCustomizerProps> = ({
  value,
  availableColors,
  onChange,
  ariaLabelPrefix = "Label color",
}) => {
  const selected =
    availableColors.find((c) => c.id === value) ?? availableColors[0] ?? null;

  const handleSelect = (id: string) => {
    if (id === value) return;
    onChange(id);
  };

  if (!availableColors.length) return null;

  return (
    <Card className="w-full border-amber-100/70 bg-[rgba(247,241,232,0.85)]/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold tracking-wide text-[color:var(--nw-ink-soft,#2b211a)] font-['Playfair_Display',theme(fontFamily.serif)]">
          Label palette
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-[color:var(--nw-cocoa,#5b3420)]/80">
          Choose a warm brandy tone for your label band. Preview updates in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 sm:gap-6">
        {/* Controls */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--nw-cocoa,#5b3420)]/80">
            Palette
          </span>
          <div
            role="radiogroup"
            aria-label={`${ariaLabelPrefix} palette`}
            className="inline-flex flex-wrap gap-2.5"
          >
            {availableColors.map((color) => {
              const isActive = selected?.id === color.id;
              const tone = color.hex;

              return (
                <Tooltip key={color.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={color.name}
                      onClick={() => handleSelect(color.id)}
                      className={cn(
                        "group relative flex h-9 w-20 items-center justify-between rounded-full border px-2.5 text-[11px] font-medium outline-none transition-colors duration-200",
                        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--nw-amber,#d28c45)] focus-visible:ring-offset-[color:var(--nw-cream,#f7f1e8)]",
                        isActive
                          ? "border-[color:var(--nw-amber-deep,#b46a2b)] bg-[color:var(--nw-cream,#f7f1e8)] text-[color:var(--nw-ink-soft,#2b211a)] shadow-sm"
                          : "border-[rgba(148,118,96,0.25)] bg-white/70 text-[color:var(--nw-cocoa,#5b3420)]/80 hover:bg-[rgba(247,241,232,0.9)]",
                      )}
                    >
                      <span className="truncate pr-1">{color.name}</span>
                      <span
                        aria-hidden="true"
                        className="relative flex h-5 w-5 items-center justify-center rounded-full border border-black/5 shadow-sm overflow-hidden"
                      >
                        <span
                          className="absolute inset-[2px] rounded-full"
                          style={{ backgroundColor: tone }}
                        />
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 24 }}
                              className="relative text-[color:var(--nw-ink-soft,#2b211a)]"
                            >
                              <Check className="h-3 w-3" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-[color:var(--nw-ink-soft,#2b211a)] text-[color:var(--nw-cream,#f7f1e8)] border-none text-xs px-2.5 py-1.5 rounded-md shadow-md"
                  >
                    <p>{color.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Bottle mockup + details */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
          {/* Bottle mockup */}
          <div className="relative flex items-center justify-center py-3 sm:py-4">
            <div className="relative h-56 w-32 sm:h-64 sm:w-36 md:h-72 md:w-40">
              {/* Bottle silhouette */}
              <motion.div
                layout
                className="absolute inset-0 rounded-[999px] border border-black/5 shadow-md"
                style={{
                  backgroundImage: bottleBaseGradient,
                }}
              />

              {/* Glass highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-[999px] overflow-hidden">
                <div className="absolute inset-y-2 left-[18%] w-[18%] bg-white/30 blur-[2px] opacity-70" />
                <div className="absolute inset-y-6 right-[22%] w-[10%] bg-white/20 blur-[1px] opacity-60" />
              </div>

              {/* Neck ring */}
              <div
                className="absolute left-1/2 top-[12%] h-[6%] w-[46%] -translate-x-1/2 rounded-full border border-black/5 bg-white/70 shadow-sm"
                style={{ boxShadow: "0 3px 6px rgba(0,0,0,0.12)" }}
              />

              {/* Label band */}
              <AnimatePresence initial={false}>
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={colorTransition}
                    aria-hidden="true"
                    className="absolute left-1/2 top-[42%] h-[32%] w-[70%] -translate-x-1/2 rounded-[22px] border border-black/5 shadow-md overflow-hidden"
                    style={{
                      backgroundColor: selected.hex,
                      boxShadow: bandShadow,
                    }}
                  >
                    {/* label inner framing */}
                    <div className="absolute inset-[10%] rounded-[18px] border border-white/35 bg-white/8" />
                    {/* label text */}
                    <div className="relative flex h-full flex-col items-center justify-center px-2 text-center">
                      <p className="text-[9px] tracking-[0.28em] uppercase text-white/80">
                        Nishant Waters
                      </p>
                      <p className="mt-1 text-[13px] leading-tight font-['Playfair_Display',theme(fontFamily.serif)] text-white">
                        Custom label
                      </p>
                      <p className="mt-0.5 text-[10px] text-white/85 tracking-wide">
                        {selected.name}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Base shadow */}
              <div className="absolute -bottom-4 left-1/2 h-5 w-[78%] -translate-x-1/2 rounded-full bg-black/10 blur-md" />
            </div>
          </div>

          {/* Metadata + selected color details */}
          <div className="flex flex-col gap-3 sm:gap-4 text-[13px] sm:text-sm text-[color:var(--nw-cocoa,#5b3420)]">
            <div className="space-y-1.5">
              <p className="uppercase tracking-[0.2em] text-[11px] text-[color:var(--nw-cocoa,#5b3420)]/80">
                Selected tone
              </p>
              {selected ? (
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="relative h-8 w-8 rounded-full border border-black/5 shadow-sm overflow-hidden">
                    <motion.div
                      key={selected.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={colorTransition}
                      className="absolute inset-[2px] rounded-full"
                      style={{ backgroundColor: selected.hex }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] sm:text-sm font-medium text-[color:var(--nw-ink-soft,#2b211a)]">
                      {selected.name}
                    </span>
                    <span className="text-[11px] text-[color:var(--nw-cocoa,#5b3420)]/80">
                      {selected.key}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[color:var(--nw-cocoa,#5b3420)]/70">
                  Choose a label color to see it here.
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-[11px] sm:text-xs text-[color:var(--nw-cocoa,#5b3420)]/80">
              <p>
                Colors are rendered in a warm, matte finish to photograph softly under
                natural and candlelight conditions.
              </p>
              <p>
                This is a visual mock only – final print tones may vary slightly in
                production.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabelCustomizer;