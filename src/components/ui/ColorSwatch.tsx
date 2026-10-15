import React from "react";
import { twMerge } from "tailwind-merge";

export interface ColorSwatchOption {
  hex: string;
  name: string;
}

interface ColorSwatchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  option: ColorSwatchOption;
  selected?: boolean;
  onChange?: (hex: string) => void;
  groupName?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  option,
  selected,
  onChange,
  groupName,
  className,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    rest.onClick?.(e);
    if (e.defaultPrevented) return;
    onChange?.(option.hex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange?.(option.hex);
    }
  };

  const borderColorClass = selected
    ? "ring-2 ring-offset-2 ring-offset-[#FFF8F0] ring-[#708238] border-[#1F130F]"
    : "border-[#E3CBB8] hover:border-[#B27A52]";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${option.name} (${option.hex})`}
      data-color-group={groupName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={twMerge(
        "relative h-9 w-9 rounded-full border bg-white flex items-center justify-center outline-none transition-[border-color,box-shadow,background-color] duration-150",
        borderColorClass,
        selected ? "shadow-[0_0_0_1px_rgba(31,19,15,0.14)]" : "shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-[#708238] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]",
        className
      )}
      {...rest}
    >
      <span
        className="h-6 w-6 rounded-full border border-black/10"
        style={{ backgroundColor: option.hex }}
      />
      {selected && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[#4A3B32] whitespace-nowrap"
        >
          {option.name}
        </span>
      )}
    </button>
  );
};

export const ColorSwatchGroup: React.FC<{
  options: ColorSwatchOption[];
  value?: string;
  onChange?: (hex: string) => void;
  ariaLabel?: string;
  className?: string;
}> = ({ options, value, onChange, ariaLabel, className }) => {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={twMerge("flex flex-wrap gap-3", className)}
    >
      {options.map((opt) => (
        <ColorSwatch
          key={opt.hex}
          option={opt}
          selected={opt.hex === value}
          onChange={onChange}
        />
      ))}
    </div>
  );
};