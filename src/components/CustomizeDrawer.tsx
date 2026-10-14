import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Product, CustomLabel, FontOption, ValidationResult } from '@/types';
import { useCart } from '@/context/CartContext';

export interface CustomizeDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product;
}

const MAX_CHARS = 30;

const baseFilterWords = ['badword', 'curse', 'offensive'];

function basicProfanityFilter(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: 'Label cannot be empty.' };
  if (trimmed.length > MAX_CHARS) {
    return { valid: false, message: `Maximum ${MAX_CHARS} characters allowed.` };
  }
  const lower = trimmed.toLowerCase();
  const hasProfanity = baseFilterWords.some(w => lower.includes(w));
  if (hasProfanity) return { valid: false, message: 'Please choose language that feels at ease.' };
  return { valid: true };
}

const labelColors = [
  { value: '#0b1f2a', name: 'Midnight' },
  { value: '#004e89', name: 'Deep Ocean' },
  { value: '#b48a60', name: 'Sandstone' },
  { value: '#d36b4f', name: 'Coral' },
];

const fontOptions: { value: FontOption; label: string; className: string }[] = [
  { value: 'serif', label: 'Serif', className: 'font-[Lora,ui-serif]' },
  { value: 'sans', label: 'Sans', className: 'font-[Sora,ui-sans-serif]' },
  { value: 'script', label: 'Script', className: 'font-[cursive]' },
];

export function CustomizeDrawer({
  open = false,
  onOpenChange,
  product,
}: CustomizeDrawerProps) {
  const { addItem } = useCart();
  const [text, setText] = useState('Nishant Waters');
  const [color, setColor] = useState(labelColors[0]?.value ?? '#0b1f2a');
  const [font, setFont] = useState<FontOption>('sans');
  const validation = useMemo(() => basicProfanityFilter(text), [text]);
  const remaining = MAX_CHARS - text.length;

  const isValid = validation.valid && !!product;

  const handleAdd = () => {
    if (!product || !isValid) return;
    const label: CustomLabel = { text: text.trim(), color, font };
    addItem({
      product,
      quantity: 1,
      customLabel: label,
    });
    toast.success('Custom bottle added to cart', {
      description: `"${label.text}" on ${product.name}`,
    });
    onOpenChange?.(false);
  };

  const currentFont = fontOptions.find(f => f.value === font);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed inset-y-0 right-0 w-full max-w-md z-50 outline-none">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="h-full bg-[#fff7ee] shadow-xl border-l border-[#e6d8c8] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6d8c8]">
              <div>
                <Dialog.Title className="text-lg font-medium text-[#0b1f2a] font-[Sora,ui-sans-serif]">
                  Design your label
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#4b5a63] mt-0.5 font-[Lora,ui-serif]">
                  Personal text, color and font for this bottle.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-2 rounded-md hover:bg-[#f4e9dc] text-[#4b5a63] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="rounded-2xl bg-[#f4e9dc] px-4 py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#4b5a63] font-[Sora,ui-sans-serif]">
                    Bottle
                  </p>
                  <p className="text-sm text-[#0b1f2a] font-[Lora,ui-serif]">
                    {product?.name ?? 'Select a bottle'}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#0b1f2a] font-[Sora,ui-sans-serif]">
                  {product ? `₹${product.price.toLocaleString('en-IN')}` : '--'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5a63] font-[Sora,ui-sans-serif]">
                  Label text
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={text}
                    maxLength={MAX_CHARS}
                    onChange={e => setText(e.target.value)}
                    placeholder="For the slow mornings, the long drives..."
                    className={cn(
                      'w-full rounded-xl border px-3 py-2.5 text-sm bg-white font-[Lora,ui-serif] outline-none transition-colors',
                      'placeholder:text-[#b39c82]',
                      validation.valid
                        ? 'border-[#e6d8c8] focus:border-[#004e89]'
                        : 'border-[#d36b4f] focus:border-[#d36b4f]'
                    )}
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={cn(
                        'font-[Lora,ui-serif]',
                        validation.valid ? 'text-[#4b5a63]' : 'text-[#d36b4f]'
                      )}
                    >
                      {validation.valid ? 'Max 30 characters' : validation.message}
                    </span>
                    <span
                      className={cn(
                        'font-[Sora,ui-sans-serif]',
                        remaining < 0 ? 'text-[#d36b4f]' : 'text-[#4b5a63]'
                      )}
                    >
                      {remaining} left
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5a63] font-[Sora,ui-sans-serif]">
                    Label color
                  </p>
                  <div className="flex gap-2">
                    {labelColors.map(sw => {
                      const active = sw.value === color;
                      return (
                        <button
                          key={sw.value}
                          type="button"
                          onClick={() => setColor(sw.value)}
                          className={cn(
                            'w-9 h-9 rounded-full border flex items-center justify-center transition-transform',
                            active ? 'border-[#004e89] scale-110' : 'border-[#e6d8c8]'
                          )}
                        >
                          <span
                            className="w-7 h-7 rounded-full"
                            style={{ backgroundColor: sw.value }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5a63] font-[Sora,ui-sans-serif]">
                    Font
                  </p>
                  <div className="flex gap-2">
                    {fontOptions.map(opt => {
                      const active = opt.value === font;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFont(opt.value)}
                          className={cn(
                            'flex-1 border rounded-xl px-3 py-2 text-xs flex items-center justify-between transition-colors',
                            'font-[Sora,ui-sans-serif]',
                            active ? 'border-[#004e89] bg-[#fff7ee]' : 'border-[#e6d8c8] bg-white'
                          )}
                        >
                          <span className="text-[#0b1f2a]">{opt.label}</span>
                          <span
                            className={cn(
                              'text-[10px] text-[#4b5a63]',
                              opt.className
                            )}
                          >
                            Nishant
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#4b5a63] font-[Sora,ui-sans-serif]">
                  Live preview
                </p>
                <div className="relative rounded-2xl bg-gradient-to-br from-[#f4e9dc] to-[#fff7ee] px-4 py-3 overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-32 rounded-full bg-[#e6d8c8] shadow-inner overflow-hidden">
                      <div className="absolute inset-x-2 top-6 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${text}-${color}-${font}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className={cn(
                              'text-[9px] text-center px-1 line-clamp-3 break-words',
                              currentFont?.className
                            )}
                            style={{ color }}
                          >
                            {text || 'Your label'}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-[#0b1f2a] font-[Lora,ui-serif]">
                        Your label wraps softly around a matte-glass bottle with a satin finish.
                      </p>
                      <p className="text-[11px] text-[#4b5a63] font-[Lora,ui-serif]">
                        Colors and type are visual approximations; final print preserves tone and rhythm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!validation.valid && (
                <div className="flex items-start gap-2 text-[11px] text-[#d36b4f] bg-[#fce9e4] border border-[#f3c1b1] rounded-xl px-3 py-2 font-[Lora,ui-serif]">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <p>{validation.message}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#e6d8c8] px-6 py-4 flex items-center justify-between gap-3 bg-[#fff7ee]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#4b5a63] font-[Lora,ui-serif]">
                <Check className="w-4 h-4 text-[#004e89]" />
                <span>Custom label included with this bottle.</span>
              </div>
              <button
                type="button"
                disabled={!isValid}
                onClick={handleAdd}
                className={cn(
                  'inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold tracking-[0.16em] uppercase font-[Sora,ui-sans-serif]',
                  'transition-colors',
                  isValid
                    ? 'bg-[#004e89] text-white hover:bg-[#003b67]'
                    : 'bg-[#e0d2c4] text-[#9d8972] cursor-not-allowed'
                )}
              >
                Add to cart
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CustomizeDrawer;