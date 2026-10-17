import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/shadcn";
import { BRANDY_PALETTE } from "@/mock";

const navLinks: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/catalog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const infoLinks: { label: string; href: string }[] = [
  { label: "Shipping & lead times", href: "#" },
  { label: "Care & reuse", href: "#" },
  { label: "Imprint guidelines", href: "#" },
];

const legalLinks: { label: string; href: string }[] = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Imprint", href: "#" },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-[rgba(91,52,32,0.16)] bg-[--nw-footer-bg] text-[--nw-footer-fg]"
      style={{
        // Warm cream base with subtle brandy tint
        // Using CSS vars so dark mode can layer gracefully if desired
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "--nw-footer-bg": BRANDY_PALETTE.cream,
        "--nw-footer-fg": BRANDY_PALETTE.inkSoft,
      }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12">
        {/* Upper grid */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand block */}
          <div className="max-w-md space-y-4">
            <Link to="/" className="inline-flex flex-col gap-1 group">
              <span className="text-sm tracking-[0.28em] uppercase text-[rgba(91,52,32,0.7)]">
                Nishant Waters
              </span>
              <span className="text-2xl sm:text-3xl font-semibold leading-snug font-['Playfair_Display'] text-[--nw-footer-fg] group-hover:tracking-[0.18em] transition-[letter-spacing,color] duration-300">
                Custom Labeled
                <span className="block">Water Bottles</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[rgba(43,33,26,0.8)]">
              Editorial water for considered spaces. Every bottle arrives as a
              quiet piece of branding—designed to live comfortably on linen,
              marble, or the glow of a late service.
            </p>
          </div>

          {/* Navigation + meta */}
          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:justify-end">
            {/* Primary nav */}
            <div className="min-w-[150px] space-y-3">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[rgba(91,52,32,0.7)]">
                Navigate
              </p>
              <nav className="flex flex-col gap-1.5 text-sm">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "inline-flex items-center gap-1.5 py-0.5 text-[rgba(43,33,26,0.82)] transition-colors duration-200",
                        isActive
                          ? `text-[${BRANDY_PALETTE.sienna}]`
                          : `hover:text-[${BRANDY_PALETTE.sienna}]`,
                      ].join(" ")
                    }
                  >
                    <span className="h-[1px] w-4 bg-[rgba(145,75,26,0.35)]" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Info */}
            <div className="min-w-[180px] space-y-3">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[rgba(91,52,32,0.7)]">
                Notes
              </p>
              <ul className="space-y-1.5 text-sm text-[rgba(43,33,26,0.82)]">
                {infoLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 py-0.5 hover:text-[${BRANDY_PALETTE.sienna}] transition-colors duration-200`}
                    >
                      <span className="h-[1px] w-3 bg-[rgba(145,75,26,0.28)]" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact / studio details */}
            <div className="min-w-[220px] space-y-3">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-[rgba(91,52,32,0.7)]">
                Studio
              </p>
              <div className="space-y-2 text-sm text-[rgba(43,33,26,0.82)]">
                <p>
                  Mon–Fri, 10:00–18:00
                  <br />
                  Los Angeles &amp; remote.
                </p>
                <p>
                  <a
                    href="mailto:hello@nishantwaters.com"
                    className="underline-offset-4 hover:underline decoration-[rgba(145,75,26,0.55)]"
                  >
                    hello@nishantwaters.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-5">
          <Separator className="bg-[rgba(91,52,32,0.16)]" />
        </div>

        {/* Lower bar */}
        <div className="flex flex-col gap-4 text-xs text-[rgba(43,33,26,0.7)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Nishant Waters. Crafted as a frontend-only mock
            experience—no backend, no payments, just an editorial preview.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {legalLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`hover:text-[${BRANDY_PALETTE.sienna}] transition-colors duration-200`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;