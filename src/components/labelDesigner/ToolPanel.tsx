import React, { useRef } from "react";
import { toast } from "sonner";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Image as ImageIcon,
  Layers,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import type {
  LabelDesign,
  LabelElement,
  LabelTextElement,
} from "./labelDesignModel";
import { cn } from "@/lib/utils";

const FONT_OPTIONS = [
  { label: "Playfair Display", value: "\"Playfair Display\", serif" },
  { label: "Inter", value: "Inter, system-ui, -apple-system, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
];

const COLOR_SWATCHES = [
  "#A0522D",
  "#F4E1D2",
  "#708238",
  "#FF6F61",
  "#40E0D0",
  "#1F2933",
];

export interface ToolPanelProps {
  design: LabelDesign;
  selectedElementId: string | null;
  onDesignChange: (design: LabelDesign) => void;
  onSelectElement: (id: string | null) => void;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  design,
  selectedElementId,
  onDesignChange,
  onSelectElement,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedElement = design.elements.find(
    (el) => el.id === selectedElementId
  );

  const pushElement = (element: LabelElement) => {
    onDesignChange({ ...design, elements: [...design.elements, element] });
    onSelectElement(element.id);
  };

  const updateSelected = (partial: Partial<LabelElement>) => {
    if (!selectedElement) return;
    onDesignChange({
      ...design,
      elements: design.elements.map((el) =>
        el.id === selectedElement.id ? { ...el, ...partial } : el
      ),
    });
  };

  const handleAddText = () => {
    const id = crypto.randomUUID();
    const textEl: LabelTextElement = {
      id,
      type: "text",
      text: "Your brand here",
      fontFamily: FONT_OPTIONS[0].value,
      color: "#1F2933",
      align: "center",
      position: { x: 0.5, y: 0.5 },
      size: { width: 0.6, height: 0.18 },
      zIndex: design.elements.length + 1,
    };
    pushElement(textEl);
    toast.success("Text block added to label");
  };

  const handleAddImageClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for the label");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file); // mock upload using object URL
    const id = crypto.randomUUID();
    const imgEl: LabelElement = {
      id,
      type: "image",
      src: url,
      alt: file.name,
      position: { x: 0.5, y: 0.55 },
      size: { width: 0.5, height: 0.35 },
      zIndex: design.elements.length + 1,
    } as any;

    pushElement(imgEl);
    toast.success("Image added to label (mock upload)");
    e.target.value = "";
  };

  const handleDelete = () => {
    if (!selectedElement) {
      toast.message("No element selected", {
        description: "Click a text or image on the canvas to select it first.",
      });
      return;
    }
    onDesignChange({
      ...design,
      elements: design.elements.filter((el) => el.id !== selectedElement.id),
    });
    onSelectElement(null);
  };

  const handleBringForward = () => {
    if (!selectedElement) return;
    const maxZ = Math.max(...design.elements.map((el) => el.zIndex));
    updateSelected({ zIndex: maxZ + 1 });
  };

  const handleSendBackward = () => {
    if (!selectedElement) return;
    const minZ = Math.min(...design.elements.map((el) => el.zIndex));
    updateSelected({ zIndex: minZ - 1 });
  };

  const handleChangeAlignment = (
    align: LabelTextElement["align"]
  ) => {
    if (!selectedElement || selectedElement.type !== "text") return;
    updateSelected({ align } as Partial<LabelElement>);
  };

  const handleChangeText = (value: string) => {
    if (!selectedElement || selectedElement.type !== "text") return;
    updateSelected({ text: value } as Partial<LabelElement>);
  };

  const handleChangeFont = (value: string) => {
    if (!selectedElement || selectedElement.type !== "text") return;
    updateSelected({ fontFamily: value } as Partial<LabelElement>);
  };

  const handleChangeColor = (value: string) => {
    if (!selectedElement) return;
    if (selectedElement.type === "text") {
      updateSelected({ color: value } as Partial<LabelElement>);
    }
  };

  return (
    <section
      aria-label="Label tools"
      className="flex h-full flex-col gap-4 rounded-2xl bg-cream-50/80 p-3 shadow-inner shadow-sand-300/60"
    >
      <header className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
            Tools
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            Add text, upload a logo (mock), and fine-tune styling.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-neutral-600 shadow-sm">
          <Layers className="h-3 w-3" />
          <span>{design.elements.length}</span>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddText}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-terracotta-300 bg-terracotta-50 px-3 py-2 text-xs font-medium text-terracotta-800 shadow-sm",
              "transition-colors transition-shadow duration-150",
              "hover:bg-terracotta-100 hover:shadow-md",
              "active:bg-terracotta-200 active:shadow-inner",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            )}
          >
            <Type className="h-3.5 w-3.5" /> Add text
          </button>
          <button
            type="button"
            onClick={handleAddImageClick}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-olive-300 bg-olive-50 px-3 py-2 text-xs font-medium text-olive-800 shadow-sm",
              "transition-colors transition-shadow duration-150",
              "hover:bg-olive-100 hover:shadow-md",
              "active:bg-olive-200 active:shadow-inner",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            )}
          >
            <ImageIcon className="h-3.5 w-3.5" /> Logo / image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-sand-200 bg-white px-2 py-1.5">
          <span className="text-[11px] font-medium tracking-wide text-neutral-600">
            Selection
          </span>
          <span className="text-[11px] text-neutral-500">
            {selectedElement ? "Element active" : "None"}
          </span>
        </div>
      </div>

      {selectedElement && (
        <div className="space-y-4 rounded-xl border border-sand-200 bg-white px-3 py-2.5">
          {selectedElement.type === "text" && (
            <div className="space-y-2">
              <label className="block text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                Copy
                <textarea
                  value={(selectedElement as LabelTextElement).text}
                  onChange={(e) => handleChangeText(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-sand-300 bg-cream-50 px-2 py-1.5 text-xs text-neutral-800 shadow-inner focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500"
                />
              </label>

              <label className="block text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                Font
                <select
                  value={(selectedElement as LabelTextElement).fontFamily}
                  onChange={(e) => handleChangeFont(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-sand-300 bg-cream-50 px-2 py-1.5 text-xs text-neutral-800 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                  Align
                </span>
                <div className="inline-flex rounded-lg bg-cream-50 p-1">
                  {([
                    ["left", AlignLeft],
                    ["center", AlignCenter],
                    ["right", AlignRight],
                  ] as const).map(([value, Icon]) => {
                    const active =
                      (selectedElement as LabelTextElement).align === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleChangeAlignment(value)}
                        aria-label={`Align ${value}`}
                        className={cn(
                          "inline-flex items-center justify-center rounded-md px-1.5 py-1 text-[11px] text-neutral-600",
                          active &&
                            "bg-terracotta-100 text-terracotta-800 shadow-sm",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              Color
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_SWATCHES.map((hex) => {
                const active =
                  selectedElement.type === "text" &&
                  (selectedElement as LabelTextElement).color === hex;
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleChangeColor(hex)}
                    aria-label={`Set color ${hex}`}
                    className={cn(
                      "h-5 w-5 rounded-full border",
                      active
                        ? "border-coral-500 ring-2 ring-coral-300"
                        : "border-sand-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                    )}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="inline-flex rounded-lg bg-cream-50 p-1">
              <button
                type="button"
                onClick={handleSendBackward}
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] text-neutral-600 hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleBringForward}
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] text-neutral-600 hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
              >
                Front
              </button>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-lg bg-coral-600 px-2 py-1 text-[11px] font-medium text-cream-50 shadow-sm transition-colors hover:bg-coral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      )}

      {!selectedElement && (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-sand-300 bg-white/60 px-3 py-4 text-[11px] text-neutral-500">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Plus className="h-3.5 w-3.5" />
            <p>
              Start by adding text or a logo, then click elements on the canvas
              to refine them here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ToolPanel;