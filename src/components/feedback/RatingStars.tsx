import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number; // 1-5
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (value: number) => void;
  id?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = "sm",
  interactive = false,
  onChange,
  id,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const displayValue = hoverValue ?? rating;

  const handleClick = (value: number) => {
    if (!interactive || !onChange) return;
    onChange(value);
  };

  const labelId = id ? `${id}-label` : undefined;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1",
        size === "sm" ? "text-[11px]" : "text-xs"
      )}
      aria-label={`${rating} out of ${max} stars`}
      role={interactive ? "radiogroup" : undefined}
      aria-labelledby={labelId}
    >
      {Array.from({ length: max }, (_, index) => {
        const value = index + 1;
        const filled = value <= displayValue;

        return (
          <button
            key={value}
            type="button"
            className={cn(
              "p-0.5 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]",
              !interactive && "cursor-default focus-visible:ring-0"
            )}
            onMouseEnter={() => interactive && setHoverValue(value)}
            onMouseLeave={() => interactive && setHoverValue(null)}
            onFocus={() => interactive && setHoverValue(value)}
            onBlur={() => interactive && setHoverValue(null)}
            onClick={() => handleClick(value)}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? value === rating : undefined}
            aria-label={interactive ? `${value} star${value > 1 ? "s" : ""}` : undefined}
            disabled={!interactive}
          >
            <Star
              className={cn(
                "transition-colors",
                size === "sm" ? "h-3 w-3" : "h-4 w-4",
                filled ? "fill-[#004D40] text-[#004D40]" : "text-[#A89F91]"
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
      <span id={labelId} className="ml-1 text-[#5C5548]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;