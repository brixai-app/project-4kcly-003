import React from "react";
import { motion } from "framer-motion";
import { Info, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import IconPicker from "./IconPicker";
import LabelPreviewBottle from "./LabelPreviewBottle";
import { validateLabelText } from "@/lib/validators";
import type { LabelDesign, LabelFontOption, LabelColorOption, LabelIconOption } from "@/types";
import { labelDesignOptions } from "@/mock";

interface LabelDesignerProps {
  value: LabelDesign;
  onChange: (value: LabelDesign, isValid: boolean) => void;
}

const MAX_CHARACTERS = 30;

const helperText = "Up to 30 characters. Letters, numbers, spaces & basic punctuation only.";

const LabelDesigner: React.FC<LabelDesignerProps> = ({ value, onChange }) => {
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fonts: LabelFontOption[] = labelDesignOptions.fonts;
  const colors: LabelColorOption[] = labelDesignOptions.colors;
  const icons: LabelIconOption[] = labelDesignOptions.icons;

  const handleUpdate = (partial: Partial<LabelDesign>) => {
    const next: LabelDesign = { ...value, ...partial };
    const validation = validateLabelText(next.text ?? "");
    const isValid = validation.valid;
    setError(validation.error || null);
    onChange(next, isValid);
  };

  const handleBlur = () => {
    setTouched(true);
    const validation = validateLabelText(value.text ?? "");
    setError(validation.error || null);
    onChange(value, validation.valid);
  };

  const remaining = MAX_CHARACTERS - (value.text?.length ?? 0);

  const selectedFont = fonts.find((f) => f.id === value.font) ?? fonts[0];
  const selectedColor = colors.find((c) => c.id === value.color) ?? colors[0];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-[0.16em] text-[#2B2B2B]/70 uppercase">
            Label Text
          </label>
          <Input
            value={value.text}
            onChange={(e) => {
              const next = e.target.value.slice(0, MAX_CHARACTERS);
              handleUpdate({ text: next });
            }}
            onBlur={handleBlur}
            placeholder="e.g. Nishant Signature Reserve"
            aria-describedby="label-text-helper label-text-error"
            aria-invalid={Boolean(error)}
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#2B2B2B]/70">
            <div id="label-text-helper" className="flex items-center gap-1">
              <Info className="h-3 w-3" aria-hidden="true" />
              <span>{helperText}</span>
            </div>
            <span>{remaining} characters left</span>
          </div>
          {touched && error && (
            <div
              id="label-text-error"
              className="mt-2 flex items-center gap-1 text-xs text-[#8b1a1a]"
            >
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold tracking-[0.16em] text-[#2B2B2B]/70 uppercase">
              Font
            </span>
            <DropdownMenu
              label={selectedFont.label}
              items={fonts.map((font) => ({ id: font.id, label: font.label }))}
              selectedId={selectedFont.id}
              onSelect={(id) => handleUpdate({ font: id })}
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs font-semibold tracking-[0.16em] text-[#2B2B2B]/70 uppercase">
              Label Color
            </span>
            <DropdownMenu
              label={selectedColor.label}
              items={colors.map((color) => ({ id: color.id, label: color.label }))}
              selectedId={selectedColor.id}
              onSelect={(id) => handleUpdate({ color: id })}
              renderItem={(item) => {
                const color = colors.find((c) => c.id === item.id)!;
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/5"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </div>
                );
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-semibold tracking-[0.16em] text-[#2B2B2B]/70 uppercase">
            Icon
          </span>
          <IconPicker
            options={icons}
            value={value.icon}
            onChange={(id) => handleUpdate({ icon: id })}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-lg border border-[#A89F91]/40 bg-white/80 p-4 text-xs text-[#2B2B2B]/75 shadow-sm"
        >
          <div className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#2B2B2B]/60">
            Curation notes
          </div>
          <p>
            Keep your message concise and timeless. Short names, initials, or event marks
            (e.g. 
            <span className="italic">N.S / 2026</span>) pair beautifully with our deep teal ink on
            matte bottles.
          </p>
        </motion.div>
      </div>

      <div className="relative flex items-center justify-center rounded-xl border border-[#A89F91]/40 bg-gradient-to-b from-[#FAF9F6] to-[#f0ede4] px-6 py-10 shadow-sm">
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top,_rgba(168,159,145,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(0,77,64,0.08),_transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xs"
        >
          <LabelPreviewBottle design={value} />
        </motion.div>
      </div>
    </div>
  );
};

export default LabelDesigner;