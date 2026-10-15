import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LabelDesigner from "./LabelDesigner";
import type { LabelDesign } from "@/types";
import { Button } from "@/components/ui/Button";

interface LabelDesignDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDesign: LabelDesign;
  onApply: (design: LabelDesign) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

const LabelDesignDrawer: React.FC<LabelDesignDrawerProps> = ({
  open,
  onOpenChange,
  initialDesign,
  onApply,
}) => {
  const [draft, setDraft] = React.useState<LabelDesign>(initialDesign);
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setDraft(initialDesign);
      setIsValid(true);
    }
  }, [open, initialDesign]);

  const handleApply = () => {
    if (!isValid) return;
    onApply(draft);
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                aria-hidden="true"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                role="dialog"
                aria-modal="true"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[640px] outline-none"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={panelVariants}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                onKeyDown={handleKeyDown}
              >
                <div className="flex h-full w-full flex-col border-l border-[#A89F91]/40 bg-[#FAF9F6] shadow-xl">
                  <header className="flex items-start justify-between border-b border-[#A89F91]/40 px-6 py-4">
                    <div>
                      <Dialog.Title className="text-sm font-semibold tracking-[0.16em] text-[#2B2B2B]/70 uppercase">
                        Design your label
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 max-w-md text-xs text-[#2B2B2B]/75">
                        Craft the typography, color, and icon that will appear on your bespoke
                        bottle. You can always adjust this before checkout.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#2B2B2B]/70 transition-colors hover:border-[#A89F91]/60 hover:text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
                        aria-label="Close label designer"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </header>

                  <div className="flex-1 overflow-y-auto px-6 py-6 pb-28">
                    <LabelDesigner
                      value={draft}
                      onChange={(design, valid) => {
                        setDraft(design);
                        setIsValid(valid);
                      }}
                    />
                  </div>

                  <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-end bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6] to-transparent px-6 pb-6 pt-8">
                    <div className="pointer-events-auto flex w-full max-w-[640px] items-center justify-between gap-3">
                      <Dialog.Close asChild>
                        <Button
                          variant="ghost"
                          size="md"
                          type="button"
                          className="border border-transparent bg-transparent px-4 text-xs font-medium text-[#2B2B2B]/80 hover:border-[#A89F91]/60 hover:bg-white"
                        >
                          Cancel
                        </Button>
                      </Dialog.Close>
                      <Button
                        type="button"
                        size="md"
                        disabled={!isValid}
                        onClick={handleApply}
                        className="px-5"
                      >
                        Apply design
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default LabelDesignDrawer;