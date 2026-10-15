export type SafeImage = {
  src: string;
  alt?: string | null;
};

/**
 * Returns a safe alt text string with a graceful fallback to
 * a generic description when alt is missing or empty.
 */
export function getSafeAltText(image: SafeImage, fallback: string): string {
  const raw = (image.alt ?? "").trim();
  if (raw.length > 0) return raw;
  return fallback;
}

/**
 * Basic responsive srcSet builder for future backend integration.
 * For now, acts as a placeholder that simply echoes the base src
 * as a single candidate while keeping the API ready for expansion.
 */
export function buildResponsiveSrcSet(src: string, sizes: number[] = [640, 1024, 1440]): string {
  if (!src) return "";

  // Placeholder: we simply return the same src with width descriptors
  // so the markup is valid and easy to upgrade when a real image CDN
  // or transformation service is plugged in.
  const uniqueSizes = Array.from(new Set(sizes.filter((s) => s > 0))).sort((a, b) => a - b);
  if (uniqueSizes.length === 0) return src;

  return uniqueSizes.map((size) => `${src} ${size}w`).join(", ");
}

/**
 * Returns a sizes attribute string optimized for common layout widths.
 * This is intentionally simple for now, but having it centralized makes
 * tuning and later dynamic behavior much easier.
 */
export function getDefaultSizesAttribute(): string {
  // Mobile-first: full width on small screens, constrained on larger.
  return "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw";
}

/**
 * Preload an image to reduce perceived layout shift for key visuals
 * like the homepage hero. Returns a promise that resolves when the
 * image has either loaded or errored.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Convenience helper for preloading a list of hero images.
 */
export async function preloadHeroImages(sources: string[]): Promise<void> {
  const distinct = Array.from(new Set(sources.filter(Boolean)));
  await Promise.all(distinct.map((src) => preloadImage(src)));
}

/**
 * Given a list of candidate hero images, choose the primary one.
 * Right now we simply pick the first truthy src; this is abstracted
 * so design tweaks or A/B testing logic can be added later.
 */
export function selectPrimaryHeroImage(images: SafeImage[]): SafeImage | null {
  for (const img of images) {
    if (img && img.src) return img;
  }
  return null;
}