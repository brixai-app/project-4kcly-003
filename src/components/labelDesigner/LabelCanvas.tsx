import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { GripVertical, Move, Type, Image as ImageIcon } from "lucide-react";
import type {
  LabelDesign,
  LabelElement,
  LabelTextElement,
  LabelImageElement,
} from "./labelDesignModel";
import { cn } from "@/lib/utils";

const CANVAS_ASPECT_RATIO = 3 / 2; // width / height label aspect

export interface LabelCanvasProps {
  design: LabelDesign;
  selectedElementId: string | null;
  onDesignChange: (design: LabelDesign) => void;
  onSelectElement: (id: string | null) => void;
}

const SNAP_DISTANCE = 4;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function snap(value: number) {
  const step = 0.05;
  const snapped = Math.round(value / step) * step;
  return Math.abs(snapped - value) * 100 < SNAP_DISTANCE ? snapped : value;
}

const LabelCanvas: React.FC<LabelCanvasProps> = ({
  design,
  selectedElementId,
  onDesignChange,
  onSelectElement,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedElement = useMemo(
    () => design.elements.find((el) => el.id === selectedElementId) || null,
    [design.elements, selectedElementId]
  );

  const updateElement = useCallback(
    (id: string, partial: Partial<LabelElement>) => {
      onDesignChange({
        ...design,
        elements: design.elements.map((el) =>
          el.id === id ? { ...el, ...partial } : el
        ),
      });
    },
    [design, onDesignChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedElement) return;
      const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!ARROW_KEYS.includes(e.key)) return;

      e.preventDefault();
      const delta = e.shiftKey ? 0.02 : 0.01;
      let { x, y } = selectedElement.position;

      if (e.key === "ArrowUp") y -= delta;
      if (e.key === "ArrowDown") y += delta;
      if (e.key === "ArrowLeft") x -= delta;
      if (e.key === "ArrowRight") x += delta;

      updateElement(selectedElement.id, {
        position: {
          x: clamp01(snap(x)),
          y: clamp01(snap(y)),
        },
      });
    },
    [selectedElement, updateElement]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSelectElement(null);
      }
    };

    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [onSelectElement]);

  const handleDrag = (
    e: React.MouseEvent,
    element: LabelElement,
    corner?: "se" | "nw"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const startPos = { ...element.position };
    const startSize = { ...element.size };

    const isResize = Boolean(corner);

    const move = (ev: MouseEvent) => {
      const diffX = ev.clientX - startX;
      const diffY = ev.clientY - startY;

      const relX = diffX / rect.width;
      const relY = diffY / rect.height / CANVAS_ASPECT_RATIO;

      if (isResize) {
        const newW = clamp01(startSize.width + relX * (corner === "se" ? 1 : -1));
        const newH = clamp01(
          startSize.height + relY * (corner === "se" ? 1 : -1)
        );
        updateElement(element.id, {
          size: { width: newW, height: newH },
        });
      } else {
        const newX = clamp01(startPos.x + relX);
        const newY = clamp01(startPos.y + relY);
        updateElement(element.id, {
          position: { x: newX, y: newY },
        });
      }
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const renderElement = (element: LabelElement) => {
    const isSelected = element.id === selectedElementId;
    const commonStyles = {
      left: `${element.position.x * 100}%`,
      top: `${element.position.y * 100}%`,
      width: `${element.size.width * 100}%`,
      height: `${element.size.height * 100}%`,
      transform: "translate(-50%, -50%)",
    } as React.CSSProperties;

    const baseClasses = cn(
      "absolute rounded-xl border transition-shadow",
      isSelected
        ? "border-olive-600 shadow-lg shadow-olive-500/30"
        : "border-transparent shadow-md shadow-neutral-900/10 hover:shadow-lg",
      "bg-transparent cursor-move focus:outline-none"
    );

    const handleSelect = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectElement(element.id);
    };

    const dragHandle = (
      <button
        type="button"
        aria-label="Drag to reposition"
        onMouseDown={(e) => handleDrag(e, element)}
        className="absolute -top-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-cream-50 text-[10px] text-terracotta-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
      >
        <Move className="h-3 w-3" />
      </button>
    );

    const resizeHandle = (
      <button
        type="button"
        aria-label="Drag to resize"
        onMouseDown={(e) => handleDrag(e, element, "se")}
        className="absolute -bottom-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-cream-50 text-[10px] text-olive-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
      >
        <GripVertical className="h-3 w-3" />
      </button>
    );

    if (element.type === "text") {
      const el = element as LabelTextElement;
      const alignClass =
        el.align === "center" ? "text-center" : el.align === "right" ? "text-right" : "text-left";

      return (
        <motion.button
          key={element.id}
          type="button"
          layout
          className={cn(baseClasses, "px-3 py-1")}
          style={{ ...commonStyles, backgroundColor: "transparent" }}
          onClick={handleSelect}
          whileHover={{ boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}
        >
          {dragHandle}
          {resizeHandle}
          <div
            className={cn(
              "h-full w-full break-words text-sm leading-snug",
              alignClass
            )}
            style={{
              fontFamily: el.fontFamily,
              color: el.color,
            }}
          >
            {el.text || "Text"}
          </div>
        </motion.button>
      );
    }

    const imgEl = element as LabelImageElement;
    return (
      <motion.button
        key={element.id}
        type="button"
        layout
        className={cn(baseClasses, "overflow-hidden bg-cream-100/70")}
        style={commonStyles}
        onClick={handleSelect}
        whileHover={{ boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}
      >
        {dragHandle}
        {resizeHandle}
        {imgEl.src ? (
          <img
            src={imgEl.src}
            alt={imgEl.alt || "Label image"}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] text-terracotta-700">
            <ImageIcon className="h-4 w-4" />
            <span>Image</span>
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <section
      aria-label="Label design canvas"
      className="flex h-full flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-800">
            Canvas
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            Drag to move, drag corners to resize. Use arrow keys for fine
            adjustments; Esc to clear selection.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-1 text-[11px] text-neutral-600">
          <Type className="h-3 w-3" />
          <ImageIcon className="h-3 w-3" />
          <span>{design.elements.length} elements</span>
        </div>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-roledescription="label editor"
        aria-describedby="label-canvas-help"
        onKeyDown={handleKeyDown}
        onClick={() => onSelectElement(null)}
        className="relative mt-1 flex w-full flex-1 items-center justify-center rounded-2xl border border-sand-300 bg-gradient-to-br from-cream-50 via-cream-100 to-sand-100/80 p-3 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
      >
        <div
          className="relative w-full max-w-full rounded-xl bg-white/90 shadow-lg shadow-neutral-900/10"
          style={{ paddingTop: `${100 / CANVAS_ASPECT_RATIO}%` }}
        >
          <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-sand-400/70 bg-cream-50/70" />

          <div className="absolute inset-3" aria-hidden="true">
            {design.elements
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => renderElement(el))}
          </div>
        </div>
      </div>
      <p
        id="label-canvas-help"
        className="text-[11px] leading-relaxed text-neutral-500"
      >
        Tip: elements gently snap to an invisible grid so your label feels
        balanced. For precise layout, hold Shift while using arrow keys to move
        faster.
      </p>
    </section>
  );
};

export default LabelCanvas;