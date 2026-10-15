import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  shop: [
    { label: "All bottles", to: "/shop" },
    { label: "Custom labels", to: "/shop?tag=custom" },
    { label: "Limited editions", to: "/shop?tag=limited" },
  ],
  studio: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Press", to: "/about?section=press" },
  ],
};

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[rgba(160,82,45,0.18)] bg-[#FFF8F0] text-[#43281C]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:py-14">
        {/* Brand story */}
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-2 text-[#A0522D]">
            <Droplets className="h-6 w-6" aria-hidden="true" />
            <span className="font-display text-xl tracking-tight">
              Nishant Waters
            </span>
          </div>
          <p className="font-display text-lg leading-relaxed text-[#5A3B2E]">
            Crafted hydration, quietly luxurious. Small-batch custom water
            bottles designed to live on your tables, not in your cupboards.
          </p>
          <p className="text-sm text-[#7A5C49]">
            Each label is printed on textured stock and wrapped by hand,
            inspired by desert ceramics and sun-warmed stone.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-1 flex-wrap gap-10 text-sm">
          <nav aria-label="Primary footer" className="min-w-[150px] space-y-3">
            <h3 className="font-display text-sm tracking-[0.16em] text-[#A0522D]">
              SHOP
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={cn(
                      "rounded-[10px] px-1 py-0.5 text-[#4A3A32] underline-offset-4",
                      "outline-none transition-colors hover:text-[#A0522D] focus-visible:bg-[#F4E1D2] focus-visible:text-[#A0522D] focus-visible:underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio footer" className="min-w-[150px] space-y-3">
            <h3 className="font-display text-sm tracking-[0.16em] text-[#A0522D]">
              STUDIO
            </h3>
            <ul className="space-y-1.5">
              {footerLinks.studio.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={cn(
                      "rounded-[10px] px-1 py-0.5 text-[#4A3A32] underline-offset-4",
                      "outline-none transition-colors hover:text-[#A0522D] focus-visible:bg-[#F4E1D2] focus-visible:text-[#A0522D] focus-visible:underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-[220px] space-y-3">
            <h3 className="font-display text-sm tracking-[0.16em] text-[#A0522D]">
              NEWSLETTER
            </h3>
            <p className="text-xs text-[#7A5C49]">
              Monthly stories from the studio—no spam, just slow rituals and
              first access to new silhouettes.
            </p>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                // Mock-only: in a real app this would call an API
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(
                    "nishant-newsletter-optin",
                    new Date().toISOString()
                  );
                }
                alert("Thank you for joining the studio list. (Mock only, no emails sent.)");
              }}
            >
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[rgba(160,82,45,0.28)] bg-white px-3 py-2 text-sm text-[#43281C] shadow-[0_0_0_1px_rgba(255,255,255,0.4)] outline-none transition-colors focus:border-[#FF6F61] focus:ring-0"
                placeholder="you@email.com"
              />
              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-[#A0522D] px-3 py-2 text-xs font-medium tracking-wide text-[#FFF8F0] shadow-sm transition-[background-color,box-shadow,transform] hover:scale-[1.03] hover:bg-[#8E4828] hover:shadow-md active:scale-95 sm:mt-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(160,82,45,0.16)] bg-[#F9EDDFFF]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-[#7A5C49] sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} Nishant Waters. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(160,82,45,0.26)] bg-white/70 text-[#7A5C49] outline-none transition-[background-color,box-shadow,transform,color] hover:scale-[1.05] hover:bg-[#F4E1D2] hover:text-[#A0522D] focus-visible:bg-[#F4E1D2] focus-visible:text-[#A0522D] focus-visible:shadow-[0_0_0_2px_rgba(255,111,97,0.55)]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;