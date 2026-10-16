import React, { useEffect, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Palette, Type, LayoutTemplate } from 'lucide-react';
import { CustomLabelData, LabelTemplate, Product } from '@/mock';

export type LabelDesignerProps = {
  product: Product;
  value: CustomLabelData | null;
  onChange: (data: CustomLabelData | null) => void;
};

type FieldErrors = {
  templateId?: string;
  customText?: string;
  textColor?: string;
  font?: string;
};

const BRAND_COLORS = [
  '#A0522D', // deep amber
  '#CBA135', // gold
  '#333333', // charcoal
  '#7C5A3A',
  '#E2C2A2',
];

const FONTS = [
  { value: 'Playfair Display', label: 'Playfair Display', className: "font-['Playfair_Display']" },
  { value: 'Inter', label: 'Inter', className: "font-['Inter']" },
  { value: 'Great Vibes', label: 'Script', className: "font-['Great_Vibes']" },
];

export const LabelDesigner: React.FC<LabelDesignerProps> = ({ product, value, onChange }) => {
  const [local, setLocal] = useState<CustomLabelData | null>(value);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setLocal((prev) => {
      if (prev) return prev;
      if (!product.labelTemplates.length) return null;
      return {
        templateId: product.labelTemplates[0].id,
        customText: '',
        textColor: BRAND_COLORS[0],
        font: FONTS[0].value,
      };
    });
  }, [product.labelTemplates]);

  useEffect(() => {
    onChange(local);
  }, [local, onChange]);

  const selectedTemplate: LabelTemplate | undefined = useMemo(() => {
    if (!local) return undefined;
    return product.labelTemplates.find((t) => t.id === local.templateId);
  }, [local, product.labelTemplates]);

  const handleField = (patch: Partial<CustomLabelData>) => {
    setLocal((prev) => ({ ...(prev as CustomLabelData), ...patch }));
  };

  const validate = (data: CustomLabelData | null): FieldErrors => {
    const next: FieldErrors = {};
    if (!data) {
      next.templateId = 'Select a label template.';
      return next;
    }
    if (!data.templateId) next.templateId = 'Select a label template.';
    if (!data.customText || !data.customText.trim()) {
      next.customText = 'Label text is required.';
    } else if (data.customText.length > 30) {
      next.customText = 'Maximum 30 characters.';
    }
    if (!data.textColor) next.textColor = 'Choose a text color.';
    if (!data.font) next.font = 'Choose a font style.';
    return next;
  };

  useEffect(() => {
    setErrors(validate(local));
  }, [local]);

  const remaining = local?.customText ? 30 - local.customText.length : 30;

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
      <div>
        <h3 className="text-lg font-semibold tracking-wide text-[#333333] font-['Playfair_Display']">
          Custom Label
        </h3>
        <p className="mt-1 text-sm text-neutral-600 font-['Inter']">
          Personalize your bottle with a bespoke label. All changes preview in real time.
        </p>

        {/* Template selector */}
        <div className="mt-6 space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[#333333] font-['Inter']">
            <LayoutTemplate className="h-4 w-4" /> Template
          </label>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-amber-200 bg-[#FFF5E1] px-3 py-2 text-sm text-[#333333] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#FFF5E1]"
              >
                <span>
                  {selectedTemplate ? selectedTemplate.name : 'Select template'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={6}
                className="z-40 w-56 rounded-md border border-amber-200 bg-white/95 p-1 shadow-lg backdrop-blur"
              >
                {product.labelTemplates.map((tpl) => (
                  <DropdownMenu.Item
                    key={tpl.id}
                    onSelect={() =>
                      handleField({ templateId: tpl.id })
                    }
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-[#333333] outline-none data-[highlighted]:bg-amber-50"
                  >
                    <img
                      src={tpl.previewImage}
                      alt={tpl.name}
                      className="h-7 w-7 rounded object-cover"
                    />
                    <span>{tpl.name}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {errors.templateId && (
            <p className="text-xs text-red-600 mt-1 font-['Inter']">{errors.templateId}</p>
          )}
        </div>

        {/* Text input */}
        <div className="mt-6 space-y-1">
          <label className="flex items-center justify-between text-sm font-medium text-[#333333] font-['Inter']">
            <span className="flex items-center gap-2">
              <Type className="h-4 w-4" /> Label text
            </span>
            <span className="text-xs text-neutral-500">{remaining} characters left</span>
          </label>
          <input
            type="text"
            maxLength={30}
            value={local?.customText ?? ''}
            onChange={(e) => handleField({ customText: e.target.value })}
            className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
            placeholder="e.g. Nishant Reserve 2024"
          />
          {errors.customText && (
            <p className="text-xs text-red-600 mt-1 font-['Inter']">{errors.customText}</p>
          )}
        </div>

        {/* Color picker */}
        <div className="mt-6 space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[#333333] font-['Inter']">
            <Palette className="h-4 w-4" /> Text color
          </label>
          <div className="flex flex-wrap gap-2">
            {BRAND_COLORS.map((c) => {
              const selected = local?.textColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleField({ textColor: c })}
                  aria-label={`Select color ${c}`}
                  className={`h-8 w-8 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#CBA135] ${
                    selected ? 'border-[#CBA135] ring-1 ring-[#CBA135]' : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              );
            })}
          </div>
          {errors.textColor && (
            <p className="text-xs text-red-600 mt-1 font-['Inter']">{errors.textColor}</p>
          )}
        </div>

        {/* Font selector */}
        <div className="mt-6 space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[#333333] font-['Inter']">
            <Type className="h-4 w-4" /> Font
          </label>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#FFF5E1]"
              >
                <span>
                  {FONTS.find((f) => f.value === local?.font)?.label ?? 'Select font'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={6}
                className="z-40 w-56 rounded-md border border-amber-200 bg-white/95 p-1 shadow-lg backdrop-blur"
              >
                {FONTS.map((font) => (
                  <DropdownMenu.Item
                    key={font.value}
                    onSelect={() => handleField({ font: font.value })}
                    className={`flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-[#333333] outline-none data-[highlighted]:bg-amber-50 ${font.className}`}
                  >
                    {font.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {errors.font && (
            <p className="text-xs text-red-600 mt-1 font-['Inter']">{errors.font}</p>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border border-amber-200 bg-gradient-to-b from-[#FFF5E1] to-[#F5E0C8] p-4 shadow-sm">
        <h4 className="text-sm font-semibold tracking-wide text-[#333333] font-['Playfair_Display']">
          Live preview
        </h4>
        <p className="mt-1 text-xs text-neutral-600 font-['Inter']">
          This is an artistic preview. Final print may have subtle variations.
        </p>
        <div className="mt-4 flex items-center justify-center rounded-lg bg-white/70 p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-amber-100 bg-white shadow-sm">
            <div className="aspect-[3/2] w-full">
              <AnimatePresence mode="wait">
                {selectedTemplate && local && (
                  <motion.div
                    key={selectedTemplate.id + local.customText + local.textColor + local.font}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full"
                  >
                    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#FFF5E1,_#E2C2A2)]">
                      <div
                        className="pointer-events-none"
                        dangerouslySetInnerHTML={{
                          __html: selectedTemplate.baseDesignSVG,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span
                          className={`max-w-[80%] text-center text-base tracking-wide ${
                            FONTS.find((f) => f.value === local.font)?.className ?? ''
                          }`}
                          style={{ color: local.textColor }}
                        >
                          {local.customText || 'Your label text'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelDesigner;