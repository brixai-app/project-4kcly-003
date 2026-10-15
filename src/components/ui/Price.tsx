import React from "react";
import { cn } from "@/lib/utils";

export type PriceProps = {
  amount: number;
  className?: string;
  currency?: string; // Currently only USD, but allows future extension
  compareAt?: number; // Optional strikethrough price for promos
  small?: boolean;
  muted?: boolean;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (amount: number, currency: string = "USD") => {
  if (currency !== "USD") {
    // Fallback simple formatting for non-USD if ever used
    return `${currency} ${amount.toFixed(2)}`;
  }
  return formatter.format(amount);
};

export const Price: React.FC<PriceProps> = ({
  amount,
  className,
  currency = "USD",
  compareAt,
  small,
  muted,
}) => {
  const hasCompare = typeof compareAt === "number" && compareAt > amount;

  return (
    <div
      className={cn(
        "flex items-baseline gap-2 font-medium",
        small && "text-sm",
        muted && "text-[color:var(--nw-ink-muted)]",
        className,
      )}
    >
      <span
        className={cn(
          "text-[color:var(--nw-ink-strong)]",
          small ? "text-sm" : "text-lg",
        )}
      >
        {formatPrice(amount, currency)}
      </span>
      {hasCompare && (
        <span
          className={cn(
            "text-xs line-through text-[color:var(--nw-ink-muted)]",
            small && "text-[0.7rem]",
          )}
          aria-label={`Original price ${formatPrice(compareAt!, currency)}`}
        >
          {formatPrice(compareAt!, currency)}
        </span>
      )}
    </div>
  );
};

export default Price;