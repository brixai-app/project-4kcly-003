import React from "react";
import { cn } from "@/lib/utils";

export interface LabelPreviewProps {
  text: string;
  font: string;
  color: string;
  icon?: "water droplet" | "leaf" | "wave" | string;
  bottleColor: "white" | "matte black" | "transparent" | string;
}

const iconToGlyph = (icon?: string): string => {
  switch (icon) {
    case "water droplet":
      return "💧";
    case "leaf":
      return "🍃";
    case "wave":
      return "〰️";
    default:
      return "";
  }
};

const bottleFillForColor = (color: string): string => {
  switch (color) {
    case "white":
      return "#FDFDFC";
    case "matte black":
      return "#2B2B2B";
    case "transparent":
      return "#F5F4EF";
    default:
      return "#FDFDFC";
  }
};

export const LabelPreviewBottle: React.FC<LabelPreviewProps> = ({
  text,
  font,
  color,
  icon,
  bottleColor,
}) => {
  const glyph = iconToGlyph(icon);
  const showText = text || "Nishant Waters";

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200/70 bg-[#FAF9F6] p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#A89F91]">
        Live label preview
      </p>
      <div className="relative flex h-56 w-24 items-center justify-center md:h-64 md:w-28">
        <svg
          viewBox="0 0 80 220"
          className="h-full w-full drop-shadow-md"
          aria-hidden="true"
        >
          {/* Cap */}
          <rect
            x="28"
            y="5"
            width="24"
            height="22"
            rx="4"
            fill="#C2BBB0"
          />
          {/* Neck */}
          <rect
            x="30"
            y="25"
            width="20"
            height="22"
            rx="8"
            fill="#E4DFD6"
          />
          {/* Bottle body */}
          <rect
            x="18"
            y="44"
            width="44"
            height="150"
            rx="20"
            fill={bottleFillForColor(bottleColor)}
            stroke="#D4CDC1"
            strokeWidth="1.5"
          />
          {/* Inner glass highlight */}
          <rect
            x="22"
            y="48"
            width="8"
            height="140"
            rx="4"
            fill="url(#highlight)"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="highlight" x1="22" y1="48" x2="30" y2="188" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#E5E0D7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Label area */}
          <rect
            x="20"
            y="90"
            width="40"
            height="60"
            rx="10"
            fill="#FAF9F6"
            stroke={color}
            strokeWidth="1.4"
          />
        </svg>

        {/* Text overlay aligned with label area */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[42px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
          {glyph && (
            <span
              className="mb-1 text-xs"
              style={{ color }}
              aria-hidden="true"
            >
              {glyph}
            </span>
          )}
          <span
            className={cn(
              "line-clamp-3 break-words text-[7px] leading-snug tracking-wide text-center",
              font === "Playfair Display" && "font-['Playfair Display']",
              font === "Bodoni" && "font-['Bodoni Moda']",
              font === "Lora" && "font-['Lora']"
            )}
            style={{ color }}
          >
            {showText}
          </span>
        </div>
      </div>
      <p className="max-w-[180px] text-center text-[11px] leading-relaxed text-neutral-600">
        This preview is simulated in the browser using mock design data only. No
        files are generated yet.
      </p>
    </div>
  );
};

export default LabelPreviewBottle;