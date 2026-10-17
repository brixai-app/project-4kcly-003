import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, RefreshCw, Type, AlignCenter, AlignLeft, AlignRight, Save, ShoppingBag, Droplets } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Slider,
} from "@/components/ui/shadcn";
import type { ID, LabelDesign, LabelPaletteColor } from "@/mock";
import { getLabelPalette, createDefaultLabelDesign } from "@/mock";
import { toast } from "sonner";

// NOTE: This is a purely frontend, mocked customization tool.
// All label designs and cart interactions are stored in localStorage via src/mock.ts only.

export interface LabelDesignerProps {
  productId: ID;
  productName: string;
  heroImage?: string;
  initialDesign?: LabelDesign;
  isSaving?: boolean;
  isAddingToCart?: boolean;
  defaultVariantId?: ID; // used when adding customized item to cart
  onSaveDesign: (design: LabelDesign) => void;
  onResetDesign: (design: LabelDesign) => void;
  onAddCustomizedToCart: (design: LabelDesign) => void;
}

interface LocalDesignState {
  backgroundColorId: ID;
  textColorHex: string;
  textValue: string;
  fontFamily: "serif" | "sans";
  size: number;
  align: "left" | "center" | "right";
}

const MIN_SIZE = 14;
const MAX_SIZE = 34;

const BRANDY_PREVIEW_BG = "#15100E"; // deep neutral backdrop for bottle preview

export const LabelDesigner: React.FC<LabelDesignerProps> = ({
  productId,
  productName,
  heroImage,
  initialDesign,
  isSaving,
  isAddingToCart,
  defaultVariantId,
  onSaveDesign,
  onResetDesign,
  onAddCustomizedToCart,
}) => {
  const palette = useMemo<LabelPaletteColor[]>(() => getLabelPalette(), []);

  const baseDesign = useMemo<LabelDesign>(() => {
    if (initialDesign) return initialDesign;
    return createDefaultLabelDesign(productId);
  }, [initialDesign, productId]);

  const [local, setLocal] = useState<LocalDesignState>(() => ({
    backgroundColorId: baseDesign.backgroundColorId,
    textColorHex: baseDesign.textColorHex,
    textValue: baseDesign.text.value || productName,
    fontFamily: baseDesign.text.fontFamily,
    size: baseDesign.text.size,
    align: baseDesign.text.align,
  }));

  // keep in sync when product or initial design changes
  useEffect(() => {
    setLocal({
      backgroundColorId: baseDesign.backgroundColorId,
      textColorHex: baseDesign.textColorHex,
      textValue: baseDesign.text.value || productName,
      fontFamily: baseDesign.text.fontFamily,
      size: baseDesign.text.size,
      align: baseDesign.text.align,
    });
  }, [baseDesign, productName]);

  const activeBg = useMemo<LabelPaletteColor | undefined>(
    () => palette.find(p => p.id === local.backgroundColorId) || palette[0],
    [local.backgroundColorId, palette],
  );

  const textAlignClass = useMemo(() => {
    switch (local.align) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  }, [local.align]);

  function handleSave() {
    const now = new Date().toISOString();
    const design: LabelDesign = {
      id: baseDesign.id,
      productId,
      backgroundColorId: local.backgroundColorId,
      textColorHex: local.textColorHex,
      text: {
        value: local.textValue.trim() || productName,
        fontFamily: local.fontFamily,
        size: local.size,
        align: local.align,
      },
      createdAt: baseDesign.createdAt || now,
      updatedAt: now,
    };

    onSaveDesign(design);
    toast.success("Label design saved", {
      description: "Your typography and color choices stay with this bottle on this device.",
    });
  }

  function handleReset() {
    const fresh = createDefaultLabelDesign(productId);
    setLocal({
      backgroundColorId: fresh.backgroundColorId,
      textColorHex: fresh.textColorHex,
      textValue: fresh.text.value || productName,
      fontFamily: fresh.text.fontFamily,
      size: fresh.text.size,
      align: fresh.text.align,
    });
    onResetDesign(fresh);
    toast("Design reset", {
      description: "We brought this label back to its studio default.",
    });
  }

  function handleAddToCart() {
    const now = new Date().toISOString();
    const design: LabelDesign = {
      id: baseDesign.id,
      productId,
      backgroundColorId: local.backgroundColorId,
      textColorHex: local.textColorHex,
      text: {
        value: local.textValue.trim() || productName,
        fontFamily: local.fontFamily,
        size: local.size,
        align: local.align,
      },
      createdAt: baseDesign.createdAt || now,
      updatedAt: now,
    };

    if (!defaultVariantId) {
      toast.error("Select a variant first", {
        description: "Choose a bottle size and cap style before adding to the cart.",
      });
      return;
    }

    onAddCustomizedToCart(design);
    toast.success("Added to cart", {
      description: "Your label layout is attached to this bottle in the mock cart.",
      icon: <Droplets className="w-4 h-4 text-amber-700" />,
    });
  }

  const bottleLabelStyle: React.CSSProperties = {
    backgroundColor: activeBg?.hex || "#E3D5C6",
    color: local.textColorHex,
  };

  const fontFamilyClass = local.fontFamily === "serif" ? "font-serif" : "font-sans";

  return (
    <Card className="w-full border-amber-100/60 bg-[#14100F] text-amber-50/95 shadow-lg shadow-black/20">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between pb-2">
        <div>
          <CardTitle className="font-serif tracking-tight text-lg sm:text-xl text-amber-50">
            Label studio
          </CardTitle>
          <CardDescription className="text-amber-100/70">
            Shape the field of color and type that wraps this bottle. All changes are stored locally on this
            device only.
          </CardDescription>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-amber-500/50 text-amber-100 hover:bg-amber-500/10 hover:text-amber-50"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-amber-600/90 hover:bg-amber-500 text-[#130F0C] px-3"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Controls */}
        <div className="w-full lg:w-[40%] space-y-6">
          <Tabs defaultValue="color" className="w-full">
            <TabsList className="grid grid-cols-2 bg-[#211814] border border-amber-900/40">
              <TabsTrigger
                value="color"
                className="data-[state=active]:bg-amber-700/90 data-[state=active]:text-[#130F0C] text-xs sm:text-sm"
              >
                <Palette className="w-3 h-3 mr-1" /> Color field
              </TabsTrigger>
              <TabsTrigger
                value="type"
                className="data-[state=active]:bg-amber-700/90 data-[state=active]:text-[#130F0C] text-xs sm:text-sm"
              >
                <Type className="w-3 h-3 mr-1" /> Type & layout
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="pt-4 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70 mb-3">
                  Label background
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <AnimatePresence initial={false}>
                    {palette.map(swatch => {
                      const isActive = swatch.id === local.backgroundColorId;
                      return (
                        <motion.button
                          key={swatch.id}
                          type="button"
                          layout
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setLocal(prev => ({
                              ...prev,
                              backgroundColorId: swatch.id,
                            }))
                          }
                          className={`group relative flex flex-col items-stretch rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14100F] ${
                            isActive
                              ? "border-amber-500/90 bg-amber-500/10 shadow-[0_0_0_1px_rgba(245,158,11,0.4)]"
                              : "border-amber-900/50 bg-[#1E1511] hover:border-amber-600/70"
                          }`}
                        >
                          <motion.div
                            layout
                            className="h-10 w-full rounded-t-md"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <div className="px-2.5 py-1.5 flex flex-col">
                            <span className="text-[11px] text-amber-50/90 leading-tight truncate">
                              {swatch.name}
                            </span>
                            {swatch.description && (
                              <span className="text-[10px] text-amber-100/55 leading-tight truncate mt-0.5">
                                {swatch.description}
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <motion.span
                              layoutId="palette-active-ring"
                              className="pointer-events-none absolute -inset-[2px] rounded-md border border-amber-400/80"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-amber-900/60 pt-4">
                <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70 mb-2">
                  Text color
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full border border-amber-900/70 overflow-hidden">
                      <input
                        aria-label="Label text color"
                        type="color"
                        value={local.textColorHex}
                        onChange={e =>
                          setLocal(prev => ({
                            ...prev,
                            textColorHex: e.target.value,
                          }))
                        }
                        className="h-full w-full cursor-pointer border-none bg-transparent p-0"
                      />
                    </div>
                    <Input
                      aria-label="Label text color hex value"
                      value={local.textColorHex}
                      onChange={e =>
                        setLocal(prev => ({
                          ...prev,
                          textColorHex: e.target.value,
                        }))
                      }
                      className="h-8 bg-[#1D1511] border-amber-900/70 text-amber-50 placeholder:text-amber-200/40 text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setLocal(prev => ({
                        ...prev,
                        textColorHex: "#2B211A",
                      }))
                    }
                    className="h-8 w-8 border border-amber-900/70 bg-[#1E1511] hover:bg-amber-500/10"
                  >
                    <Droplets className="w-3.5 h-3.5 text-amber-300" />
                    <span className="sr-only">Reset text color</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="type" className="pt-4 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70">
                    Label text
                  </p>
                  <span className="text-[10px] text-amber-200/55">
                    Up to 60 characters
                  </span>
                </div>
                <Input
                  aria-label="Custom label text"
                  value={local.textValue}
                  maxLength={60}
                  onChange={e =>
                    setLocal(prev => ({
                      ...prev,
                      textValue: e.target.value,
                    }))
                  }
                  className="bg-[#1D1511] border-amber-900/70 text-amber-50 placeholder:text-amber-200/40"
                  placeholder={productName}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70">
                    Typeface
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={local.fontFamily === "serif" ? "default" : "outline"}
                      onClick={() =>
                        setLocal(prev => ({
                          ...prev,
                          fontFamily: "serif",
                        }))
                      }
                      className={`${
                        local.fontFamily === "serif"
                          ? "bg-amber-600/90 text-[#130F0C] border-amber-400/80"
                          : "bg-[#1E1511] border-amber-900/70 text-amber-100 hover:bg-amber-500/10"
                      } font-serif text-xs px-3`}
                    >
                      Serif
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={local.fontFamily === "sans" ? "default" : "outline"}
                      onClick={() =>
                        setLocal(prev => ({
                          ...prev,
                          fontFamily: "sans",
                        }))
                      }
                      className={`${
                        local.fontFamily === "sans"
                          ? "bg-amber-600/90 text-[#130F0C] border-amber-400/80"
                          : "bg-[#1E1511] border-amber-900/70 text-amber-100 hover:bg-amber-500/10"
                      } font-sans text-xs px-3`}
                    >
                      Sans
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70">
                    Alignment
                  </p>
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      size="icon"
                      variant={local.align === "left" ? "default" : "outline"}
                      onClick={() =>
                        setLocal(prev => ({
                          ...prev,
                          align: "left",
                        }))
                      }
                      className={`${
                        local.align === "left"
                          ? "bg-amber-600/90 text-[#130F0C] border-amber-400/80"
                          : "bg-[#1E1511] border-amber-900/70 text-amber-100 hover:bg-amber-500/10"
                      } h-8 w-8`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                      <span className="sr-only">Left aligned label text</span>
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant={local.align === "center" ? "default" : "outline"}
                      onClick={() =>
                        setLocal(prev => ({
                          ...prev,
                          align: "center",
                        }))
                      }
                      className={`${
                        local.align === "center"
                          ? "bg-amber-600/90 text-[#130F0C] border-amber-400/80"
                          : "bg-[#1E1511] border-amber-900/70 text-amber-100 hover:bg-amber-500/10"
                      } h-8 w-8`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                      <span className="sr-only">Center aligned label text</span>
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant={local.align === "right" ? "default" : "outline"}
                      onClick={() =>
                        setLocal(prev => ({
                          ...prev,
                          align: "right",
                        }))
                      }
                      className={`${
                        local.align === "right"
                          ? "bg-amber-600/90 text-[#130F0C] border-amber-400/80"
                          : "bg-[#1E1511] border-amber-900/70 text-amber-100 hover:bg-amber-500/10"
                      } h-8 w-8`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                      <span className="sr-only">Right aligned label text</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.15em] text-amber-200/70">
                    Text size
                  </p>
                  <span className="text-[10px] text-amber-200/55">{local.size}px</span>
                </div>
                <Slider
                  aria-label="Label text size"
                  value={[local.size]}
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={1}
                  onValueChange={vals =>
                    setLocal(prev => ({
                      ...prev,
                      size: vals[0] ?? prev.size,
                    }))
                  }
                  className="w-full cursor-pointer [&_[role=slider]]:border-amber-300 [&_[role=slider]]:bg-amber-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-amber-900/60"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-[#130F0C] shadow-md shadow-amber-900/50"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add customized bottle"}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="w-full lg:w-[60%]">
          <div className="relative w-full rounded-xl bg-[radial-gradient(circle_at_top,_#3B2417_0,_#0B0503_55%,_#000000_100%)] border border-amber-900/70 overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]">
            <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-soft-light bg-[radial-gradient(circle_at_20%_0,_rgba(250,250,250,0.12)_0,_transparent_50%),radial-gradient(circle_at_80%_100%,_rgba(248,250,252,0.16)_0,_transparent_55%)]" />

            <div className="relative z-10 h-full w-full flex items-center justify-center px-6 py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-8 w-full max-w-[520px]"
              >
                {/* Bottle representation */}
                <div className="flex-1 flex justify-center">
                  <div className="relative flex flex-col items-center">
                    {/* Neck */}
                    <div className="w-8 h-10 rounded-t-full bg-gradient-to-b from-[#F6F3EE] via-[#D6C7B6] to-[#A88C70] shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
                    {/* Shoulder & body */}
                    <div className="relative w-16 sm:w-20 h-40 sm:h-48 rounded-b-[28px] rounded-t-xl bg-gradient-to-b from-[#F9F4EC] via-[#E6D5C4] to-[#B69F87] shadow-[0_18px_30px_rgba(0,0,0,0.55)] flex items-center justify-center overflow-visible">
                      {/* Glass highlight */}
                      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.42)_0,transparent_28%,transparent_70%,rgba(0,0,0,0.15)_100%)] mix-blend-screen opacity-90" />
                      {/* Label area */}
                      <motion.div
                        key={activeBg?.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-[76%] h-[40%] rounded-[14px] border border-black/10 shadow-[0_0_0_1px_rgba(0,0,0,0.35)] overflow-hidden flex"
                        style={bottleLabelStyle}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.25)_0,transparent_45%),radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.33)_0,transparent_40%)] mix-blend-soft-light opacity-70" />
                        <div
                          className={`relative z-10 px-2.5 sm:px-3 py-2 sm:py-2.5 flex w-full h-full ${textAlignClass}`}
                        >
                          <span
                            className={`${fontFamilyClass} text-[11px] sm:text-[13px] leading-snug tracking-[0.16em] uppercase`}
                            style={{ fontSize: `${local.size}px` }}
                          >
                            {local.textValue.trim() || productName}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="hidden sm:flex sm:flex-col sm:w-40 text-amber-100/80 text-[11px] tracking-wide gap-3">
                  <div>
                    <p className="uppercase tracking-[0.16em] text-amber-200/70 mb-1">Palette</p>
                    <p className="font-serif text-xs text-amber-50">
                      {activeBg?.name || "Studio tone"}
                    </p>
                    {activeBg?.description && (
                      <p className="text-[11px] text-amber-100/60 mt-0.5 line-clamp-3">
                        {activeBg.description}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-amber-900/80 pt-2">
                    <p className="uppercase tracking-[0.16em] text-amber-200/70 mb-1">
                      Text treatment
                    </p>
                    <p className="text-[11px] text-amber-100/80">
                      {local.fontFamily === "serif" ? "Playful serif logotype" : "Quiet sans caption"}
                    </p>
                    <p className="text-[11px] text-amber-100/70 mt-0.5">
                      {local.align === "center" && "Centered for classic symmetry."}
                      {local.align === "left" && "Ragged left for a more editorial feel."}
                      {local.align === "right" && "Right-aligned for a discreet side signature."}
                    </p>
                  </div>
                  <div className="mt-auto text-[10px] text-amber-200/55">
                    This is a visual mock only. Final print alignment and color may vary in real production.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* hero image overlay, if provided */}
            {heroImage && (
              <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none opacity-25 mix-blend-luminosity hidden md:block">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              </div>
            )}

            {/* bottom vignette */}
            <div
              className="absolute inset-x-0 bottom-0 h-20"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabelDesigner;