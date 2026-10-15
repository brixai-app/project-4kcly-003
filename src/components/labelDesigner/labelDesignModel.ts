// Pure, framework-agnostic label design model utilities.
// This file intentionally contains no React. It can be unit-tested independently.

export type LabelElementKind = "text" | "image";

export interface LabelBaseElement {
  id: string;
  type: LabelElementKind;
  x: number; // 0–1 normalized horizontal position
  y: number; // 0–1 normalized vertical position
  width: number; // 0–1 normalized width
  height: number; // 0–1 normalized height
  rotation: number; // degrees
  zIndex: number;
}

export interface LabelTextElement extends LabelBaseElement {
  type: "text";
  text: string;
  fontFamily: "Playfair Display" | "Inter";
  fontSize: number; // px
  color: string; // hex or css color
  align: "left" | "center" | "right";
}

export interface LabelImageElement extends LabelBaseElement {
  type: "image";
  src: string; // mock URL or data URI
  opacity: number; // 0–1
  fit: "contain" | "cover";
}

export type LabelElement = LabelTextElement | LabelImageElement;

export interface LabelDesign {
  id: string;
  name: string;
  backgroundColor: string;
  elements: LabelElement[];
  lastUpdated: number;
}

// Utilities

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10));

export const createEmptyDesign = (name = "Untitled label"): LabelDesign => ({
  id: randomId(),
  name,
  backgroundColor: "#FFF8F0",
  elements: [],
  lastUpdated: Date.now(),
});

// Element factories

export interface AddTextPayload {
  text?: string;
  fontFamily?: LabelTextElement["fontFamily"];
  color?: string;
}

export const addTextElement = (
  design: LabelDesign,
  payload: AddTextPayload = {}
): LabelDesign => {
  const {
    text = "Your name",
    fontFamily = "Playfair Display",
    color = "#573F2F",
  } = payload;

  const base: LabelTextElement = {
    id: randomId(),
    type: "text",
    x: 0.5,
    y: 0.4,
    width: 0.6,
    height: 0.18,
    rotation: 0,
    zIndex: getNextZIndex(design),
    text,
    fontFamily,
    fontSize: 26,
    color,
    align: "center",
  };

  return {
    ...design,
    elements: [...design.elements, base],
    lastUpdated: Date.now(),
  };
};

export interface AddImagePayload {
  src?: string; // optional, we create a mock placeholder if missing
}

export const addImageElement = (
  design: LabelDesign,
  payload: AddImagePayload = {}
): LabelDesign => {
  const src =
    payload.src ||
    "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg"; // mock image only

  const base: LabelImageElement = {
    id: randomId(),
    type: "image",
    x: 0.5,
    y: 0.65,
    width: 0.45,
    height: 0.22,
    rotation: 0,
    zIndex: getNextZIndex(design),
    src,
    opacity: 0.96,
    fit: "contain",
  };

  return {
    ...design,
    elements: [...design.elements, base],
    lastUpdated: Date.now(),
  };
};

// Generic element update/remove

export const updateElement = <T extends Partial<LabelElement>>(
  design: LabelDesign,
  id: string,
  patch: T
): LabelDesign => {
  const elements = design.elements.map((el) =>
    el.id === id ? ({ ...el, ...normalizeElementPatch(el, patch) } as LabelElement) : el
  );
  return {
    ...design,
    elements,
    lastUpdated: Date.now(),
  };
};

export const removeElement = (design: LabelDesign, id: string): LabelDesign => ({
  ...design,
  elements: design.elements.filter((el) => el.id !== id),
  lastUpdated: Date.now(),
});

// Hit-testing & snapping

export interface HitTestOptions {
  x: number; // 0–1
  y: number; // 0–1
}

export const hitTestElement = (
  design: LabelDesign,
  { x, y }: HitTestOptions
): LabelElement | null => {
  const within = design.elements.filter((el) =>
    x >= el.x - el.width / 2 &&
    x <= el.x + el.width / 2 &&
    y >= el.y - el.height / 2 &&
    y <= el.y + el.height / 2
  );

  if (!within.length) return null;
  return within.reduce((top, el) => (el.zIndex > top.zIndex ? el : top));
};

export interface SnapOptions {
  x: number;
  y: number;
  threshold?: number; // normalized
}

export interface SnapResult {
  x: number;
  y: number;
  snapX?: number; // guideline position
  snapY?: number;
}

const SNAP_LINES_X = [0.25, 0.5, 0.75];
const SNAP_LINES_Y = [0.25, 0.5, 0.75];

export const applySnapping = ({ x, y, threshold = 0.03 }: SnapOptions): SnapResult => {
  let snapX: number | undefined;
  let snapY: number | undefined;

  for (const line of SNAP_LINES_X) {
    if (Math.abs(x - line) <= threshold) {
      snapX = line;
      break;
    }
  }

  for (const line of SNAP_LINES_Y) {
    if (Math.abs(y - line) <= threshold) {
      snapY = line;
      break;
    }
  }

  return {
    x: snapX ?? x,
    y: snapY ?? y,
    snapX,
    snapY,
  };
};

// Serialization helpers (for saving to localStorage or sending to backend later)

export const serializeDesign = (design: LabelDesign): string => {
  return JSON.stringify(design);
};

export const deserializeDesign = (raw: string | null | undefined): LabelDesign | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LabelDesign;
    if (!parsed || !Array.isArray(parsed.elements)) return null;
    return parsed;
  } catch {
    return null;
  }
};

// Validation

export const isDesignValid = (design: LabelDesign | null | undefined): boolean => {
  if (!design) return false;
  return design.elements.length >= 1;
};

// Internal helpers

const getNextZIndex = (design: LabelDesign): number => {
  if (!design.elements.length) return 1;
  return design.elements.reduce((max, el) => (el.zIndex > max ? el.zIndex : max), 0) + 1;
};

const normalizeElementPatch = (
  original: LabelElement,
  patch: Partial<LabelElement>
): Partial<LabelElement> => {
  const out: Partial<LabelElement> = { ...patch };

  if (patch.x !== undefined) out.x = clamp(patch.x, 0, 1);
  if (patch.y !== undefined) out.y = clamp(patch.y, 0, 1);
  if (patch.width !== undefined) out.width = clamp(patch.width, 0.05, 1);
  if (patch.height !== undefined) out.height = clamp(patch.height, 0.05, 1);
  if (patch.rotation !== undefined) out.rotation = patch.rotation % 360;

  if (patch.type === "text" || (patch as any).text !== undefined) {
    const textEl = original.type === "text" ? (original as LabelTextElement) : null;
    if (textEl) {
      const maybe = patch as Partial<LabelTextElement>;
      if (maybe.fontSize !== undefined) {
        (out as Partial<LabelTextElement>).fontSize = clamp(maybe.fontSize, 10, 72);
      }
    }
  }

  if (patch.type === "image" || (patch as any).src !== undefined) {
    const imgEl = original.type === "image" ? (original as LabelImageElement) : null;
    if (imgEl) {
      const maybe = patch as Partial<LabelImageElement>;
      if (maybe.opacity !== undefined) {
        (out as Partial<LabelImageElement>).opacity = clamp(maybe.opacity, 0, 1);
      }
    }
  }

  return out;
};

// Convenience for moving an element while respecting snapping and bounds

export interface MoveElementOptions {
  id: string;
  x: number;
  y: number;
}

export const moveElement = (
  design: LabelDesign,
  { id, x, y }: MoveElementOptions
): { design: LabelDesign; snapX?: number; snapY?: number } => {
  const snapped = applySnapping({ x, y });
  const clampedX = clamp(snapped.x, 0, 1);
  const clampedY = clamp(snapped.y, 0, 1);

  const next = updateElement(design, id, { x: clampedX, y: clampedY });

  return { design: next, snapX: snapped.snapX, snapY: snapped.snapY };
};

// Reordering elements to front/back

export const bringToFront = (design: LabelDesign, id: string): LabelDesign => {
  const max = getNextZIndex({ ...design, elements: design.elements }) - 1;
  return updateElement(design, id, { zIndex: max });
};

export const sendToBack = (design: LabelDesign, id: string): LabelDesign => {
  const min = design.elements.reduce(
    (lowest, el) => (el.zIndex < lowest ? el.zIndex : lowest),
    design.elements[0]?.zIndex ?? 0
  );
  return updateElement(design, id, { zIndex: min - 1 });
};