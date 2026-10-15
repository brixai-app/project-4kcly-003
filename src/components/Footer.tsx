import React, { useState, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, Instagram, Facebook, Linkedin, Twitter, MapPin, Clock, ArrowUpRight, CheckCircle2, AlertCircle, QrCode, Sparkles, Shield, Truck, Globe2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import mockData from '@/data/mockData';
import type { FAQEntry, PressSnippet } from '@/data/mockData';
import type { ToastIntent } from '@/types';

export interface FooterProps {
  className?: string;
  showNewsletter?: boolean;
  showSurfaceRibbons?: boolean;
}

interface NewsletterFormState {
  email: string;
  intent: 'studio-notes' | 'launches' | 'hospitality';
  volumePreference: 'gifting' | 'events' | 'personal';
  consent: boolean;
  isSubmitting: boolean;
  touched: {
    email: boolean;
    consent: boolean;
  };
}

interface ValidationResult {
  valid: boolean;
  message?: string;
  field?: keyof NewsletterFormState | 'form';
  intent?: ToastIntent;
}

function useNewsletterForm() {
  const [state, setState] = useState<NewsletterFormState>({
    email: '',
    intent: 'studio-notes',
    volumePreference: 'personal',
    consent: false,
    isSubmitting: false,
    touched: {
      email: false,
      consent: false,
    },
  });

  const setField = useCallback(
    <K extends keyof NewsletterFormState>(key: K, value: NewsletterFormState[K]) => {
      setState(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const setTouched = useCallback((field: keyof NewsletterFormState['touched']) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  }, []);

  const validate = useCallback(
    (draft?: NewsletterFormState): ValidationResult => {
      const s = draft ?? state;
      if (!s.email.trim()) {
        return {
          valid: false,
          field: 'email',
          intent: 'error',
          message: 'Add an email so we know where to send your studio notes.',
        };
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(s.email.trim())) {
        return {
          valid: false,
          field: 'email',
          intent: 'error',
          message: 'That email feels a little off. Try a different address.',
        };
      }
      if (!s.consent) {
        return {
          valid: false,
          field: 'consent',
          intent: 'warning',
          message: 'Please confirm you’re comfortable receiving email from us.',
        };
      }
      return { valid: true };
    },
    [state]
  );

  const reset = useCallback(() => {
    setState({
      email: '',
      intent: 'studio-notes',
      volumePreference: 'personal',
      consent: false,
      isSubmitting: false,
      touched: {
        email: false,
        consent: false,
      },
    });
  }, []);

  const submit = useCallback(async () => {
    const next: NewsletterFormState = {
      ...state,
      isSubmitting: true,
    };
    const result = validate(next);
    if (!result.valid) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        touched: {
          ...prev.touched,
          email: result.field === 'email' ? true : prev.touched.email,
          consent: result.field === 'consent' ? true : prev.touched.consent,
        },
      }));
      toast(result.message ?? 'We couldn’t save your preferences just yet.', {
        style: {
          backgroundColor: '#fff7ee',
          borderRadius: 18,
          border: '1px solid #e7d6c6',
          color: '#333333',
        },
      });
      return { ok: false, error: result };
    }

    setState(prev => ({
      ...prev,
      isSubmitting: true,
    }));

    await new Promise(resolve => {
      setTimeout(resolve, 800);
    });

    const selectedIntentLabel =
      next.intent === 'studio-notes'
        ? 'studio notes'
        : next.intent === 'launches'
        ? 'launch announcements'
        : 'hospitality stories';

    toast('You’re in. Expect quietly refreshing emails only when it matters.', {
      description: `We’ll pour ${selectedIntentLabel} into your inbox for ${next.volumePreference} moments.`,
      style: {
        backgroundColor: '#fff7ee',
        borderRadius: 18,
        border: '1px solid #e7d6c6',
        color: '#333333',
      },
    });

    reset();
    return { ok: true };
  }, [reset, state, validate]);

  return {
    state,
    setField,
    setTouched,
    validate,
    submit,
  };
}

function FooterNewsletterPanel() {
  const { state, setField, setTouched, submit } = useNewsletterForm();
  const [hoveredIntent, setHoveredIntent] = useState<NewsletterFormState['intent'] | null>(null);

  const emailError = useMemo(() => {
    if (!state.touched.email) return '';
    if (!state.email.trim()) return 'Add your best email.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(state.email.trim())) return 'That doesn’t look like a valid email.';
    return '';
  }, [state.email, state.touched.email]);

  const consentError = useMemo(() => {
    if (!state.touched.consent) return '';
    if (!state.consent) return 'We need your blessing to send an occasional note.';
    return '';
  }, [state.consent, state.touched.consent]);

  const currentIntentLabel = useMemo(() => {
    const intent = hoveredIntent ?? state.intent;
    if (intent === 'studio-notes') {
      return 'Slow editorial dispatches on hydration culture, material stories, and the studio table.';
    }
    if (intent === 'launches') {
      return 'Only drops that matter: limited glass, collaborations, and first access to waitlists.';
    }
    return 'Tailored perspectives for hotels, restaurants, and events that host with intention.';
  }, [hoveredIntent, state.intent]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <section className="w-full bg-[#f5e9dc] border-t border-[#e7d6c6]">
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-12 lg:py-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-24 w-64 h-64 rounded-[999px] bg-[#fff7ee]/90 blur-3xl" />
          <div className="absolute -bottom-10 -left-24 w-72 h-72 rounded-[999px] bg-[#fff7ee]/80 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#6b625a] bg-[#fff7ee]/80 border border-[#e7d6c6] rounded-full px-3 py-1 w-fit">
                <Sparkles className="w-3 h-3" />
                <span>Studio dispatch</span>
              </p>
              <h2 className="font-['DM_Sans'] text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight text-[#333333]">
                Quietly luminous hydration,
                <br className="hidden sm:block" />
                once in a while in your inbox.
              </h2>
              <p className="font-['Lora'] text-[13px] sm:text-[14px] leading-relaxed text-[#6b625a] max-w-xl">
                No flash sale spam. Just considered notes when we launch something we would proudly
                place on your tables — plus the occasional behind-the-scenes from the Nishant Waters
                studio.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] tracking-[0.22em] uppercase text-[#6b625a]">Choose your pour</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { key: 'studio-notes', label: 'Studio notes' },
                  { key: 'launches', label: 'Launches' },
                  { key: 'hospitality', label: 'Hospitality' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setField('intent', item.key as NewsletterFormState['intent'])
                    }
                    onMouseEnter={() =>
                      setHoveredIntent(item.key as NewsletterFormState['intent'])
                    }
                    onMouseLeave={() => setHoveredIntent(null)}
                    className={cn(
                      'relative inline-flex items-center justify-center rounded-[999px] border text-[11px] sm:text-[11px] px-3 sm:px-3.5 py-1.5 sm:py-2 transition-all',
                      state.intent === item.key
                        ? 'bg-[#007a8a] border-[#007a8a] text-white shadow-sm shadow-[#007a8a]/40'
                        : 'bg-[#fff7ee]/70 border-[#e7d6c6] text-[#6b625a] hover:bg-white hover:border-[#d2bfa9]'
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#6b625a] leading-relaxed max-w-lg">
                {currentIntentLabel}
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 flex">
            <motion.form
              onSubmit={onSubmit}
              className="relative flex-1 bg-[#fff7ee]/95 border border-[#e7d6c6] rounded-[22px] md:rounded-[24px] px-5 sm:px-6 py-5 sm:py-6 lg:px-7 lg:py-7 flex flex-col gap-5 shadow-[0_18px_45px_rgba(0,0,0,0.04)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[12px] font-medium text-[#333333]">Slip into the list</p>
                  <p className="text-[11px] text-[#6b625a]">
                    One list, three pours. Choose your lane and we’ll keep it light.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#6b625a]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>We don’t sell your data.</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#6b625a] mb-1.5">
                    <span>Email address</span>
                    <span className="normal-case text-[11px] text-[#a28f7b]">Required</span>
                  </span>
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-[999px] border px-3.5 py-2.5 bg-white/80 focus-within:ring-2 focus-within:ring-[#007a8a]/20 focus-within:border-[#007a8a] transition-all',
                      emailError
                        ? 'border-[#d67a5b] bg-[#fff3ee]'
                        : 'border-[#e7d6c6] hover:border-[#d2bfa9]'
                    )}
                  >
                    <Mail className="w-4 h-4 text-[#6b625a]" />
                    <input
                      type="email"
                      value={state.email}
                      onChange={e => setField('email', e.target.value)}
                      onBlur={() => setTouched('email')}
                      placeholder="you@brand.com"
                      className="flex-1 bg-transparent text-[13px] md:text-[13px] text-[#333333] placeholder:text-[#b6a89a] outline-none"
                    />
                    <AnimatePresence initial={false}>
                      {!emailError && state.email.trim() ? (
                        <motion.div
                          key="email-valid"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#007a8a]" />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence initial={false}>
                    {emailError ? (
                      <motion.p
                        key="email-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 mt-1 text-[11px] text-[#b8593b]"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{emailError}</span>
                      </motion.p>
                    ) : (
                      <motion.p
                        key="email-helper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-[11px] text-[#a28f7b]"
                      >
                        We send a note roughly once a month — sometimes less.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b625a] mb-1.5">
                      Volume
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: 'personal', label: 'Personal stash' },
                        { key: 'gifting', label: 'Gifting & hospitality' },
                        { key: 'events', label: 'Events & launches' },
                      ].map(option => (
                        <button
                          type="button"
                          key={option.key}
                          onClick={() =>
                            setField(
                              'volumePreference',
                              option.key as NewsletterFormState['volumePreference']
                            )
                          }
                          className={cn(
                            'inline-flex items-center rounded-[999px] border px-3 py-1.5 text-[11px] transition-all',
                            state.volumePreference === option.key
                              ? 'bg-[#007a8a] border-[#007a8a] text-white shadow-sm shadow-[#007a8a]/40'
                              : 'bg-transparent border-[#e7d6c6] text-[#6b625a] hover:bg-[#f5e9dc]'
                          )}
                        >
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b625a] mb-1.5">
                      Beat
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#6b625a]">
                        <span>Rhythm</span>
                        <span className="text-[#333333] font-medium">
                          {state.intent === 'launches'
                            ? 'Only drops'
                            : state.intent === 'hospitality'
                            ? 'Curated'
                            : 'Slow & steady'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#f5e9dc] overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full bg-[#007a8a] transition-all',
                            state.intent === 'launches'
                              ? 'w-5/6'
                              : state.intent === 'hospitality'
                              ? 'w-3/5'
                              : 'w-2/5'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => setField('consent', !state.consent)}
                  onBlur={() => setTouched('consent')}
                  className={cn(
                    'mt-0.5 w-4.5 h-4.5 rounded-[9px] border flex items-center justify-center transition-all',
                    state.consent
                      ? 'bg-[#007a8a] border-[#007a8a]'
                      : 'bg-white border-[#e7d6c6] hover:border-[#d2bfa9]'
                  )}
                  aria-pressed={state.consent}
                >
                  <AnimatePresence initial={false}>
                    {state.consent ? (
                      <motion.span
                        key="consent-check"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
                <div className="flex-1 space-y-0.5">
                  <p className="text-[12px] text-[#333333]">
                    I’m comfortable receiving thoughtful email from Nishant Waters.
                  </p>
                  <p
                    className={cn(
                      'text-[11px]',
                      consentError ? 'text-[#b8593b]' : 'text-[#a28f7b]'
                    )}
                  >
                    You can unsubscribe in a single click at any time.
                  </p>
                </div>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1.5">
                <button
                  type="submit"
                  disabled={state.isSubmitting}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-[999px] px-4 sm:px-5 py-2.5 text-[12px] font-medium tracking-[0.14em] uppercase transition-all bg-[#007a8a] text-white shadow-[0_12px_30px_rgba(0,122,138,0.40)] hover:bg-[#006674] active:scale-[0.98]',
                    state.isSubmitting && 'opacity-80 cursor-not-allowed'
                  )}
                >
                  <span>{state.isSubmitting ? 'Pouring you in...' : 'Save preferences'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-[11px] text-[#6b625a]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Skip email? Pin our hydration guide QR in your studio pantry.</span>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FooterLinkColumnProps {
  title?: string;
  links?: {
    label: string;
    to?: string;
    href?: string;
    external?: boolean;
  }[];
}

export function FooterLinkColumn({
  title = 'Column',
  links = [],
}: FooterLinkColumnProps) {
  const navigate = useNavigate();
  const handleClick = (link: { to?: string; href?: string; external?: boolean }) => {
    if (link.external && link.href) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (link.to) {
      navigate(link.to);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] tracking-[0.24em] uppercase text-[#6b625a]">
        {title}
      </p>
      <ul className="space-y-1.5">
        {links.map(item => (
          <li key={item.label}>
            {item.to ? (
              <Link
                to={item.to}
                className="flex items-center justify-between gap-1 text-[13px] text-[#333333] hover:text-[#007a8a] transition-colors"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#b6a89a]" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => handleClick(item)}
                className="group flex w-full items-center justify-between gap-1 text-left text-[13px] text-[#333333] hover:text-[#007a8a] transition-colors"
              >
                <span>{item.label}</span>
                {item.external ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#b6a89a] group-hover:text-[#007a8a]" />
                ) : null}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FooterPressStripProps {
  items?: PressSnippet[];
}

export function FooterPressStrip({ items }: FooterPressStripProps) {
  const pressItems = items ?? mockData?.pressSnippets ?? [];
  if (!pressItems.length) {
    return null;
  }

  return (
    <section className="w-full bg-[#fff7ee] border-t border-[#e7d6c6]">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-6 lg:py-7 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f5e9dc] border border-[#e7d6c6]">
              <Sparkles className="w-3.5 h-3.5 text-[#007a8a]" />
            </span>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#6b625a]">
              Noted by
            </p>
          </div>
          <p className="hidden sm:block text-[11px] text-[#6b625a]">
            A few voices that have poured Nishant Waters onto their pages.
          </p>
        </div>

        <div className="relative -mx-4 sm:mx-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#fff7ee] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#fff7ee] to-transparent" />
          <motion.div
            className="flex gap-5 sm:gap-7 overflow-x-auto no-scrollbar py-1 px-4 sm:px-0"
            initial={false}
          >
            {pressItems.slice(0, 6).map(item => (
              <article
                key={item.id}
                className="min-w-[210px] max-w-[260px] rounded-[18px] border border-[#e7d6c6] bg-white/80 px-4 py-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b625a]">
                    {item.outlet}
                  </p>
                  <span className="text-[11px] text-[#a28f7b]">{item.year}</span>
                </div>
                <p className="text-[12px] text-[#333333] leading-snug line-clamp-3">
                  “{item.quote}”
                </p>
                <p className="mt-2 text-[11px] text-[#a28f7b]">
                  {item.context}
                </p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface FooterBottomBarProps {
  className?: string;
}

export function FooterBottomBar({ className }: FooterBottomBarProps) {
  const location = useLocation();
  const year = useMemo(() => new Date().getFullYear(), []);
  const isDesignRoute = location?.pathname?.includes('/design');

  return (
    <section
      className={cn(
        'w-full bg-[#fff7ee] border-t border-[#e7d6c6]',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-[#6b625a]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#f5e9dc]">
            <Globe2 className="w-3 h-3 text-[#007a8a]" />
          </span>
          <span>
            © {year} Nishant Waters Studio. Crafted in India, shipping quietly worldwide.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#6b625a]">
          <span>₹ – Primary currency</span>
          <span className="h-3 w-px bg-[#e7d6c6]" />
          <span>{isDesignRoute ? 'You’re in the design studio.' : 'You’re browsing the collection.'}</span>
          <span className="h-3 w-px bg-[#e7d6c6]" />
          <Link
            to="/contact"
            className="inline-flex items-center gap-1 hover:text-[#007a8a] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Concierge</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer({
  className,
  showNewsletter = true,
  showSurfaceRibbons = true,
}: FooterProps) {
  const faqs = (mockData?.faqs ?? []).filter(
    faq => faq?.category === 'shipping' || faq?.category === 'orders'
  );
  const shippingFaq: FAQEntry | undefined = faqs?.[0];

  return (
    <footer
      className={cn(
        'w-full bg-[#f5e9dc] text-[#333333] border-t border-[#e7d6c6] mt-16',
        className
      )}
    >
      {showNewsletter ? <FooterNewsletterPanel /> : null}

      <section className="relative w-full bg-[#fff7ee]">
        {showSurfaceRibbons ? (
          <div className="absolute inset-x-0 -top-6 flex justify-center pointer-events-none">
            <div className="h-3 w-40 rounded-full bg-[#f5e9dc] opacity-80 blur-md" />
          </div>
        ) : null}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-14 pt-8 pb-10 md:pt-10 md:pb-12 lg:pt-12 lg:pb-14">
          <div className="grid grid-cols-12 gap-10 lg:gap-12">
            <div className="col-span-12 md:col-span-4 space-y-4 md:space-y-5">
              <div className="space-y-1.5">
                <p className="text-[11px] tracking-[0.26em] uppercase text-[#6b625a]">
                  Nishant Waters
                </p>
                <h3 className="font-['DM_Sans'] text-[22px] md:text-[24px] tracking-tight text-[#333333]">
                  Water, turned into a piece of your story.
                </h3>
              </div>
              <p className="font-['Lora'] text-[13px] md:text-[14px] leading-relaxed text-[#6b625a]">
                From intimate tablescapes to large-format brand moments, our custom-labeled water
                bottles are designed to sit quietly yet confidently in your space — considered,
                tactile, undeniably yours.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[18px] bg-[#f5e9dc] border border-[#e7d6c6]">
                    <Truck className="w-4.5 h-4.5 text-[#007a8a]" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-medium">Shipping & returns</p>
                    <p className="text-[12px] text-[#6b625a]">
                      Pan-India delivery with timeline clarity. Breakage support on arrival.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-[#333333]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[18px] bg-[#f5e9dc] border border-[#e7d6c6]">
                    <Shield className="w-4.5 h-4.5 text-[#007a8a]" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-medium">Responsible sourcing</p>
                    <p className="text-[12px] text-[#6b625a]">
                      Spring and mineral profiles with traceable origins and refill-forward
                      thinking.
                    </p>
                  </div>
                </div>

                {shippingFaq ? (
                  <div className="rounded-[16px] border border-dashed border-[#e7d6c6] bg-[#f5e9dc]/60 px-3.5 py-3 space-y-1.5">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#6b625a]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Shipping highlight</span>
                    </p>
                    <p className="text-[13px] text-[#333333] line-clamp-3">
                      {shippingFaq.question}
                    </p>
                    <p className="text-[11px] text-[#6b625a] line-clamp-2">
                      {shippingFaq.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 lg:col-span-5 grid grid-cols-2 gap-6 md:gap-8">
              <FooterLinkColumn
                title="Customer care"
                links={[
                  { label: 'Shop collection', to: '/shop' },
                  { label: 'Design your label', to: '/design' },
                  { label: 'Bespoke & bulk', to: '/contact' },
                  { label: 'Order tracking', to: '/checkout' },
                  { label: 'Care & refills', to: '/about' },
                ]}
              />
              <FooterLinkColumn
                title="Studio"
                links={[
                  { label: 'Our story', to: '/about' },
                  { label: 'Sustainability', to: '/about' },
                  { label: 'Press & features', to: '/about' },
                  { label: 'Trade & hospitality', to: '/contact' },
                  {
                    label: 'Brand assets',
                    href: 'https://example.com',
                    external: true,
                  },
                ]}
              />
            </div>

            <div className="col-span-12 md:col-span-3 lg:col-span-3 space-y-4 md:space-y-5">
              <div className="space-y-2">
                <p className="text-[11px] tracking-[0.24em] uppercase text-[#6b625a]">
                  Concierge
                </p>
                <div className="space-y-1.5 text-[13px] text-[#333333]">
                  <a
                    href="mailto:hello@nishantwaters.com"
                    className="inline-flex items-center gap-2 hover:text-[#007a8a] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>hello@nishantwaters.com</span>
                  </a>
                  <a
                    href="tel:+919000000000"
                    className="inline-flex items-center gap-2 hover:text-[#007a8a] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 90000 00000</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1.5 text-[12px] text-[#6b625a]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5" />
                  <p>
                    Studio tastings by appointment only.
                    <br />
                    Lower Parel, Mumbai.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 mt-0.5" />
                  <p>
                    Monday – Friday, 11am – 7pm IST
                    <br />
                    Select weekend slots for weddings & events.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] tracking-[0.24em] uppercase text-[#6b625a]">
                  Social
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-[14px] border border-[#e7d6c6] bg-[#f5e9dc] hover:bg-[#007a8a] hover:border-[#007a8a] hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-[14px] border border-[#e7d6c6] bg-[#f5e9dc] hover:bg-[#007a8a] hover:border-[#007a8a] hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-[14px] border border-[#e7d6c6] bg-[#f5e9dc] hover:bg-[#007a8a] hover:border-[#007a8a] hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-[14px] border border-[#e7d6c6] bg-[#f5e9dc] hover:bg-[#007a8a] hover:border-[#007a8a] hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="pt-1.5">
                <p className="text-[11px] text-[#a28f7b]">
                  All product photography and bottle silhouettes shown are indicative storyboards. Final
                  custom labels are reviewed and proofed before bottling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPressStrip />
      <FooterBottomBar />
    </footer>
  );
}

export default Footer;