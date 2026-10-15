import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud } from "lucide-react";
import {
  products,
  patternOptions,
  initialLabelTemplate,
  validateLabel,
  formatMoney,
  palette,
} from "../mock";
import { toast } from "sonner";

interface LabelDesignerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string | null;
  onAddToCart: (payload: {
    productId: string;
    customLabel: any;
  }) => void;
}

interface DraggableTextState {
  x: number;
  y: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const LabelDesignerDrawer: React.FC<LabelDesignerDrawerProps> = ({
  open,
  onOpenChange,
  productId,
  onAddToCart,
}) => {
  const product = useMemo(
    () => products.find((p) => p.id === productId) ?? products[0],
    [productId]
  );

  const [label, setLabel] = useState(() => initialLabelTemplate(product.id));
  const [drag, setDrag] = useState<DraggableTextState>({ x: 50, y: 50 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!product) return;
    setLabel(initialLabelTemplate(product.id));
    setDrag({ x: 50, y: 50 });
    setErrors({});
  }, [productId, product?.id]);

  const handleTextChange = (value: string) => {
    if (value.length > 100) return;
    setLabel((prev) => ({ ...prev, text: value }));
  };

  const handleFontChange = (font: "Inter" | "Playfair Display") => {
    setLabel((prev) => ({ ...prev, textFont: font }));
  };

  const handlePatternChange = (patternId: string) => {
    setLabel((prev) => ({ ...prev, backgroundPattern: patternId }));
  };

  const handleColorChange = (color: string) => {
    setLabel((prev) => ({ ...prev, textColor: color }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/(png|jpg|jpeg)$/i.test(file.type.split("/")[1] || "")) {
      toast.error("Images must be PNG or JPEG.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLabel((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          { url, position: { x: 60, y: 60 } },
        ],
      }));
      toast.success("Image added to your label (mock upload).");
    };
    reader.readAsDataURL(file);
  };

  const isValid = Object.keys(validateLabel(label)).length === 0;

  const onAdd = () => {
    const v = validateLabel(label);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("Please fix label details before adding to cart.");
      return;
    }
    onAddToCart({ productId: product.id, customLabel: label });
    toast.success("Added customized bottle to cart (mock).",
      { description: "You can review it in the cart drawer." }
    );
    onOpenChange(false);
  };

  const handleBottlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDrag({ x, y });
    setIsDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handleBottlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = Math.min(
      90,
      Math.max(10, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.min(
      80,
      Math.max(20, ((e.clientY - rect.top) / rect.height) * 100)
    );
    setDrag({ x, y });
  };

  const handleBottlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/30 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Portal>
        )}
      </AnimatePresence>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <Dialog.Content asChild>
              <motion.aside
                className="fixed inset-y-0 right-0 w-full sm:w-[420px] md:w-[480px] bg-[#FFF8F0] z-50 shadow-2xl border-l border-amber-200 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-amber-200">
                  <div>
                    <Dialog.Title className="font-playfair text-lg text-[#1B3A2D]">
                      Customize your label
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-600 mt-0.5">
                      Design a label that feels like you—text, pattern, and imagery.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 border border-amber-200 shadow-sm hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
                  <section className="rounded-2xl bg-white border border-amber-100 shadow-sm px-4 py-3 flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm text-[#1B3A2D] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <p className="font-medium text-sm text-[#D9822B]">
                      {formatMoney(product.price)}
                    </p>
                  </section>

                  <section className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-700">
                        Label text
                      </label>
                      <textarea
                        value={label.text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        rows={3}
                        className={`w-full rounded-xl border px-3 py-2 text-sm bg-white shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                          errors.text
                            ? "border-red-400"
                            : "border-amber-200 focus:border-[#FF6B61]"
                        }`}
                        placeholder="A note, a mantra, a name…"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{label.text.length}/100 characters</span>
                        {errors.text && (
                          <span className="text-red-500">{errors.text}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700">Font</p>
                        <div className="flex gap-2">
                          {(["Inter", "Playfair Display"] as const).map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => handleFontChange(f)}
                              className={`flex-1 rounded-full border px-2 py-1 text-xs shadow-sm transition-colors ${
                                label.textFont === f
                                  ? "border-[#D9822B] bg-[#FFF8F0] text-[#1B3A2D]"
                                  : "border-amber-200 bg-white text-slate-700 hover:bg-amber-50"
                              } ${f === "Playfair Display" ? "font-playfair" : "font-inter"}`}
                            >
                              {f === "Inter" ? "Inter" : "Playfair"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700">Text color</p>
                        <div className="flex gap-2">
                          {[palette.ink, palette.forest, palette.coral].map(
                            (c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => handleColorChange(c)}
                                className={`h-7 w-7 rounded-full border shadow-sm flex items-center justify-center ${
                                  label.textColor === c
                                    ? "border-[#FF6B61]"
                                    : "border-amber-200"
                                }`}
                              >
                                <span
                                  className="h-4 w-4 rounded-full"
                                  style={{ backgroundColor: c }}
                                />
                                <span className="sr-only">Choose color</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-700 flex items-center justify-between">
                        Background pattern
                        {errors.backgroundPattern && (
                          <span className="text-[11px] text-red-500">
                            {errors.backgroundPattern}
                          </span>
                        )}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {patternOptions.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handlePatternChange(p.id)}
                            className={`relative rounded-xl overflow-hidden border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              label.backgroundPattern === p.id
                                ? "border-[#D9822B]"
                                : "border-amber-200 hover:border-[#D9822B]"
                            }`}
                          >
                            <img
                              src={p.preview}
                              alt={p.name}
                              className="h-14 w-full object-cover"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white drop-shadow-sm truncate">
                              {p.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-700">Add an image</p>
                      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-amber-300 bg-white px-3 py-2 text-xs text-slate-700 hover:border-[#D9822B]">
                        <div className="flex items-center gap-2">
                          <UploadCloud className="h-4 w-4 text-amber-500" />
                          <span>PNG or JPEG, up to 5MB</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Browse</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          className="hidden"
                          onChange={onFileChange}
                        />
                      </label>
                      {label.images?.length ? (
                        <p className="text-[11px] text-slate-500">
                          {label.images.length} image attached (mocked client-only).
                        </p>
                      ) : null}
                    </div>
                  </section>

                  <section className="rounded-2xl bg-gradient-to-b from-amber-50 via-[#FFF8F0] to-amber-100 border border-amber-200 px-4 py-4">
                    <p className="text-xs font-medium text-slate-700 mb-2">
                      Bottle preview (drag text on bottle)
                    </p>
                    <div
                      className="relative mx-auto h-64 w-32 sm:h-72 sm:w-36 flex items-center justify-center"
                      onPointerDown={handleBottlePointerDown}
                      onPointerMove={handleBottlePointerMove}
                      onPointerUp={handleBottlePointerUp}
                    >
                      <div className="absolute inset-x-6 inset-y-3 bg-gradient-to-b from-white via-[#FFF8F0] to-amber-100 rounded-full shadow-lg" />
                      <div className="absolute inset-x-7 top-2 bottom-10 rounded-3xl overflow-hidden" style={{
                        backgroundImage: `url(${patternOptions.find((p) => p.id === label.backgroundPattern)?.preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }} />
                      {label.images?.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt="Label element"
                          className="absolute h-10 w-10 rounded-full object-cover border border-white shadow-md"
                          style={{
                            left: `${drag.x}%`,
                            top: `${drag.y + idx * 10}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute px-2 py-1 rounded-full bg-white/90 shadow-md border border-amber-200 cursor-grab active:cursor-grabbing"
                        style={{
                          left: `${drag.x}%`,
                          top: `${drag.y}%`,
                          transform: "translate(-50%, -50%)",
                          color: label.textColor,
                          fontFamily:
                            label.textFont === "Playfair Display"
                              ? "'Playfair Display', serif"
                              : "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-[11px] leading-snug">
                          {label.text || "Your text here"}
                        </span>
                      </motion.div>
                    </div>
                  </section>
                </div>

                <div className="border-t border-amber-200 px-4 sm:px-6 py-4 flex items-center justify-between bg-[#FFF3E2]">
                  <div className="text-xs text-slate-700">
                    <p className="font-medium text-[#1B3A2D]">
                      {formatMoney(product.price)} per bottle
                    </p>
                    <p>Custom label included. Ships in ~1 week.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: isValid ? 1.03 : 1 }}
                    whileTap={{ scale: isValid ? 0.96 : 1 }}
                    type="button"
                    disabled={!isValid}
                    onClick={onAdd}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF3E2] ${
                      isValid
                        ? "bg-[#1B3A2D] text-[#FFF8F0] hover:bg-[#15402F]"
                        : "bg-slate-300 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    Add to cart
                  </motion.button>
                </div>
              </motion.aside>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LabelDesignerDrawer;