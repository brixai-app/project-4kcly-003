import React from "react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

interface DropdownMenuProps<T = string> {
  label?: string;
  "aria-label"?: string;
  options: DropdownOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
}

/**
 * Accessible dropdown built on Radix UI.
 * Used for selecting fonts, colors, sizes, etc.
 */
export function DropdownMenu<T = string>(props: DropdownMenuProps<T>) {
  const {
    label,
    "aria-label": ariaLabel,
    options,
    value,
    onChange,
    disabled,
    className,
    triggerClassName,
    align = "start",
  } = props;

  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      {label && (
        <span className="text-xs font-medium tracking-wide text-[#6B655B]">
          {label}
        </span>
      )}

      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "flex items-center justify-between gap-2 rounded-full border border-[#D3CDC3] bg-white/80 px-3 py-2 text-sm text-[#2B2B2B] shadow-sm outline-none transition-colors",
              "hover:border-[#004D40] hover:bg-white",
              "focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FAF9F6]",
              disabled &&
                "cursor-not-allowed border-[#E3DDD3] bg-[#F3EFE7] text-[#A89F91]",
              triggerClassName
            )}
            aria-label={ariaLabel || label}
          >
            <span className="truncate text-left">
              {selected ? selected.label : "Select"}
            </span>
            <ChevronDown className="h-4 w-4 text-[#A89F91]" aria-hidden="true" />
          </button>
        </RadixDropdownMenu.Trigger>

        <RadixDropdownMenu.Portal>
          <RadixDropdownMenu.Content
            className={cn(
              "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-[#E3DDD3] bg-[#FFFBF5]/95 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-sm",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
            sideOffset={6}
            align={align}
          >
            <RadixDropdownMenu.RadioGroup
              value={
                (value as unknown as string | undefined) ?? undefined
              }
              onValueChange={(val) => {
                const opt = options.find(
                  (o) => String(o.value) === String(val)
                );
                if (opt) onChange(opt.value);
              }}
            >
              {options.map((opt) => {
                const optValue = String(opt.value);
                const isSelected = String(value) === optValue;
                return (
                  <RadixDropdownMenu.RadioItem
                    key={optValue}
                    value={optValue}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm text-[#2B2B2B] outline-none",
                      "focus:bg-[#F0EBE3]",
                      "data-[state=checked]:bg-[#E6F3F1]",
                      "hover:bg-[#F4EFE6]"
                    )}
                  >
                    <span className="flex-1 truncate">{opt.label}</span>
                    <span className="pl-2">
                      <Check
                        className={cn(
                          "h-4 w-4 transition-opacity",
                          isSelected
                            ? "opacity-100 text-[#004D40]"
                            : "opacity-0 text-transparent"
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </RadixDropdownMenu.RadioItem>
                );
              })}
            </RadixDropdownMenu.RadioGroup>

            <RadixDropdownMenu.Arrow className="fill-[#FFFBF5]" />
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
      </RadixDropdownMenu.Root>
    </div>
  );
}

export default DropdownMenu;