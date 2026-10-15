import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Wand2 } from "lucide-react";
import type { LabelDesign } from "./labelDesignModel";
import LabelCanvas from "./LabelCanvas";
import ToolPanel from "./ToolPanel";
import PreviewBottleMockup from "./PreviewBottleMockup";

export interface LabelDesignDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDesign?: LabelDesign | null;
  onSave: (design: LabelDesign) => void;
}

const defaultDesign: LabelDesign = {
  id: "temp",
  elements: [],
};

const LabelDesignDrawer: React.FC<LabelDesignDrawerProps> = ({
  open,
  onOpenChange,
  initialDesign,
  onSave,
}) => {
  const [design, setDesign] = useState<LabelDesign>(initialDesign || defaultDesign);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDesign(initialDesign || { ...defaultDesign, id: crypto.randomUUID() });
      setSelectedElementId(null);
    }
  }, [open, initialDesign]);

  const handleSave = () => {
    if (design.elements.length === 0) {
      toast.error("Add at least one text or image element before saving");
      return;
    }
    const finalDesign: LabelDesign = {
      ...design,
      id: design.id || crypto.randomUUID(),
    };
    onSave(finalDesign);
    toast.success("Label design saved to this cart item");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-5xl flex-col bg-cream-50/95 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              >
                <div className="flex items-center justify-between border-b border-sand-200 bg-cream-50/80 px-6 py-4">
                  <div>
                    <Dialog.Title className="font-display text-lg font-semibold tracking-wide text-neutral-900">
                      Design your label
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-neutral-600">
                      Craft a custom label for your Nishant Waters bottle. All
                      changes here are mock-only and live in your browser.
                    </Dialog.Description>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-neutral-600 shadow-sm transition-colors hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                    aria-label="Close label designer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 pb-4 pt-3 md:px-6">
                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                      <ToolPanel
                        design={design}
                        selectedElementId={selectedElementId}
                        onDesignChange={setDesign}
                        onSelectElement={setSelectedElementId}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <LabelCanvas
                        design={design}
                        selectedElementId={selectedElementId}
                        onDesignChange={setDesign}
                        onSelectElement={setSelectedElementId}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <PreviewBottleMockup design={design} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-sand-200 bg-cream-50/60 px-2 py-3 text-xs text-neutral-600 md:flex-row md:items-center md:justify-between md:px-4">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-3.5 w-3.5 text-coral-500" />
                      <p>
                        This is a visual mock only – designs are stored locally in
                        your browser and applied to your cart item.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex items-center justify-center rounded-xl border border-sand-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-colors hover:bg-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center justify-center rounded-xl bg-coral-600 px-4 py-1.5 text-xs font-semibold text-cream-50 shadow-md shadow-coral-600/40 transition-transform transition-shadow hover:scale-[1.02] hover:bg-coral-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 active:scale-95"
                      >
                        Save label
                      </button>
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