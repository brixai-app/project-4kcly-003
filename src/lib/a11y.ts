import { useEffect, useRef } from 'react';

// Reduced motion hook to respect user preferences
export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [prefersReduced, setPrefersReduced] = ((): [boolean, (v: boolean) => void] => {
    // Simple internal state without importing React's useState here
    let value = false;
    const setter = (v: boolean) => {
      value = v;
    };
    return [value, setter];
  })();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia(query);
    if (mediaQuery.matches) setPrefersReduced(true);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query, setPrefersReduced]);

  return prefersReduced;
}

// Focus trap utility for drawers/modals
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = containerRef.current;
    if (!node) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      if (focusable.length === 0) return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    node.addEventListener('keydown', handleKeyDown as any);
    return () => node.removeEventListener('keydown', handleKeyDown as any);
  }, [active]);

  return containerRef;
}

export type EscapeHandler = () => void;

export function createEscapeKeyHandler(onEscape: EscapeHandler) {
  return function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onEscape();
    }
  };
}

export function useEscapeKey(onEscape: EscapeHandler, active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape, active]);
}

export function buildAriaLabel(
  base: string,
  options?: { selected?: string; context?: string }
): string {
  const parts = [base];
  if (options?.selected) parts.push(`Selected: ${options.selected}`);
  if (options?.context) parts.push(options.context);
  return parts.join('. ');
}

export function setAriaHiddenForBackground(hidden: boolean, excludeId?: string) {
  if (typeof document === 'undefined') return;
  const rootChildren = Array.from(document.body.children);
  rootChildren.forEach((el) => {
    if (excludeId && el.id === excludeId) return;
    if (hidden) {
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('aria-hidden');
    }
  });
}