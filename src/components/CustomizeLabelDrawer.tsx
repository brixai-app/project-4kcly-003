import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  CustomLabel,
  FONT_OPTIONS,
  LABEL_COLOR_PALETTE,
  LABEL_TEXT_MAX,
  createDefaultLabel,
  validateImageFile,
  validateLabelText,
} from '@/mock';
import { AccessibleDropdown, BodyText, MotionButton } from './ui';

interface CustomizeLabelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLabel?: CustomLabel;
  onSave: (label: CustomLabel) => void;
}

export const CustomizeLabelDrawer: React.FC<CustomizeLabelDrawerProps> = ({
  open,
  onOpenChange,
  initialLabel,
  onSave,
}) => {
  const [workingLabel, setWorkingLabel] = useState<CustomLabel>(() =>
    initialLabel ?? createDefaultLabel(),
  );
  const [textError, setTextError] = useState<string | undefined>();
  const [logoError, setLogoError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setWorkingLabel(initialLabel ?? createDefaultLabel());
      setTextError(undefined);
      setLogoError(undefined);
    }
  }, [open, initialLabel]);

  const handleColorSelect = (color: string) => {
    setWorkingLabel(prev => ({ ...prev, backgroundColor: color }));
  };

  const handleTextChange = (value: string) => {
    setWorkingLabel(prev => ({ ...prev, text: value }));
    const res = validateLabelText(value);
    setTextError(res.valid ? undefined : res.error);
  };

  const handleFontChange = (value: string) => {
    setWorkingLabel(prev => ({ ...prev, font: value as any }));
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setLogoError(error);
      toast.error(error || 'Invalid logo');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setWorkingLabel(prev => ({ ...prev, logoImage: dataUrl }));
      setLogoError(undefined);
      toast.success('Logo added');
    };
    reader.onerror = () => {
      setLogoError('Failed to read file.');
      toast.error('Unable to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setWorkingLabel(prev => ({ ...prev, logoImage: undefined }));
  };

  const handleSave = () => {
    const validation = validateLabelText(workingLabel.text);
    if (!validation.valid) {
      setTextError(validation.error);
      toast.error(validation.error || 'Label text invalid');
      return;
    }
    onSave({ ...workingLabel });
    toast.success('Label saved');
    onOpenChange(false);
  };

  const fontClass = (() => {
    if (workingLabel.font === 'Poppins') return "font-['Poppins']";
    if (workingLabel.font === 'Merriweather') return "font-['Merriweather']";
    return "font-['Pacifico']";
  })();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-[#FAF9F6] shadow-2xl data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
          <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
            <Dialog.Title className="text-base font-semibold text-slate-900 font-['Poppins']">
              Customize your label
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close label designer"
                className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4D5B]/70"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            <BodyText className="text-xs text-slate-600">
              This is a mock, client-side label designer. Uploads stay in your browser and are never sent to a
              server.
            </BodyText>

            {/* Color picker */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 font-['Poppins']">Label tone</h3>
              <p className="mt-1 text-xs text-slate-500 font-['Merriweather']">
                Choose a background color that reflects your event, brand, or ritual.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LABEL_COLOR_PALETTE.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`h-8 w-8 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0E4D5B] ${
                      workingLabel.backgroundColor === color
                        ? 'border-[#0E4D5B] ring-2 ring-[#0E4D5B]/40'
                        : 'border-slate-300 hover:border-slate-500'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select label color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Text + font */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="label-text"
                  className="block text-sm font-medium text-slate-800 font-['Poppins']"
                >
                  Label text
                </label>
                <textarea
                  id="label-text"
                  maxLength={LABEL_TEXT_MAX}
                  value={workingLabel.text}
                  onChange={e => handleTextChange(e.target.value)}
                  className={`mt-1 block w-full resize-none rounded-xl border bg-[#FAF9F6] px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#0E4D5B] focus:ring-2 focus:ring-[#0E4D5B]/70 focus:outline-none ${
                    textError && 'border-red-400 focus:border-red-500 focus:ring-red-400/70'
                  }`}
                  rows={2}
                />
                <div className="mt-1 flex items-center justify-between text-[11px] font-['Merriweather']">
                  <span className={textError ? 'text-red-500' : 'text-slate-500'}>
                    {textError ? textError : 'Max 30 characters'}
                  </span>
                  <span className="text-slate-400">
                    {workingLabel.text.length}/{LABEL_TEXT_MAX}
                  </span>
                </div>
              </div>

              <AccessibleDropdown
                label="Font style"
                value={workingLabel.font}
                onChange={e => handleFontChange(e.target.value)}
                options={FONT_OPTIONS.map(f => ({ label: f.label, value: f.value }))}
              />
            </div>

            {/* Logo uploader */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 font-['Poppins']">Logo (optional)</h3>
              <p className="mt-1 text-xs text-slate-500 font-['Merriweather']">
                Upload a small PNG or JPEG logo up to 2MB. It will sit centered on your label.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={e => handleLogoUpload(e.target.files?.[0] || null)}
              />

              <div className="mt-3 flex items-center gap-3">
                <MotionButton
                  type="button"
                  variant="ghost"
                  className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-4 py-2 text-xs font-['Merriweather'] text-slate-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload logo
                </MotionButton>
                {workingLabel.logoImage && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 transition-colors hover:bg-slate-200 font-['Merriweather']"
                  >
                    <Trash2 className="mr-1.5 h-3 w-3" /> Remove
                  </button>
                )}
              </div>

              {logoError && (
                <p className="mt-1 text-xs text-red-500 font-['Merriweather']">{logoError}</p>
              )}

              {workingLabel.logoImage && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={workingLabel.logoImage}
                      alt="Logo preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-['Merriweather']">
                    Preview of your uploaded logo. This stays only in your browser.
                  </p>
                </div>
              )}
            </div>

            {/* 3D preview */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 font-['Poppins']">Bottle preview</h3>
              <p className="mt-1 text-xs text-slate-500 font-['Merriweather']">
                A simplified 3D mockup helps you sense how your label will feel on the bottle.
              </p>
              <div className="mt-3 flex justify-center">
                <div className="relative h-56 w-24 origin-bottom rounded-full bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
                  {/* Bottle cap */}
                  <div className="absolute -top-4 left-1/2 h-5 w-10 -translate-x-1/2 rounded-t-full bg-slate-500/90" />
                  {/* Label */}
                  <div
                    className="absolute left-1/2 top-16 h-24 w-20 -translate-x-1/2 rounded-2xl border border-slate-200/80 shadow-inner"
                    style={{ backgroundColor: workingLabel.backgroundColor }}
                  >
                    {workingLabel.logoImage && (
                      <div className="mx-auto mt-2 h-8 w-12 overflow-hidden rounded-lg bg-white/50">
                        <img
                          src={workingLabel.logoImage}
                          alt="Logo on label"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex h-full items-end justify-center px-2 pb-3">
                      <span
                        className={`line-clamp-3 text-center text-[10px] text-slate-800 ${fontClass}`}
                      >
                        {workingLabel.text || 'Your label text'}
                      </span>
                    </div>
                  </div>
                  {/* Reflection highlight */}
                  <div className="pointer-events-none absolute inset-y-6 left-2 w-3 rounded-full bg-white/40 blur-[2px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 px-6 py-4 flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500 font-['Merriweather']">
              Changes are stored only in this session until you add the bottle to cart.
            </p>
            <MotionButton
              onClick={handleSave}
              className="rounded-2xl px-4 py-2 text-xs font-['Merriweather']"
            >
              Save label
            </MotionButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};