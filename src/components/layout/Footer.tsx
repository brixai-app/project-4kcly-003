import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[#DDD5C7]/70 bg-[#F3F1EB] text-[#2B2B2B]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-md space-y-4">
          <h2 className="font-['Playfair_Display'] text-xl tracking-wide text-[#2B2B2B]">
            Nishant Waters
          </h2>
          <p className="text-sm leading-relaxed text-[#4A4A4A]">
            Bespoke hydration, meticulously crafted. Custom labeled water bottles that
            carry your story in every detail.
          </p>
        </div>

        <div className="flex flex-1 flex-wrap gap-10 lg:justify-end">
          <div className="space-y-3 text-sm">
            <div className="font-['Bodoni_Moda'] text-xs uppercase tracking-[0.18em] text-[#6B6256]">
              Navigate
            </div>
            <nav className="flex flex-col gap-1" aria-label="Footer navigation">
              <Link
                to="/"
                className="inline-flex text-sm text-[#4A4A4A] transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="inline-flex text-sm text-[#4A4A4A] transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="inline-flex text-sm text-[#4A4A4A] transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="inline-flex text-sm text-[#4A4A4A] transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-['Bodoni_Moda'] text-xs uppercase tracking-[0.18em] text-[#6B6256]">
              Connect
            </div>
            <div className="flex gap-3" aria-label="Social links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Nishant Waters on Instagram"
                className="inline-flex items-center justify-center rounded-full border border-[#A89F91]/60 bg-white p-2 text-[#4A4A4A] shadow-sm transition-colors duration-200 hover:border-[#004D40] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Nishant Waters on Facebook"
                className="inline-flex items-center justify-center rounded-full border border-[#A89F91]/60 bg-white p-2 text-[#4A4A4A] shadow-sm transition-colors duration-200 hover:border-[#004D40] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Nishant Waters on Twitter"
                className="inline-flex items-center justify-center rounded-full border border-[#A89F91]/60 bg-white p-2 text-[#4A4A4A] shadow-sm transition-colors duration-200 hover:border-[#004D40] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F1EB]"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DDD5C7]/70 bg-[#FAF9F6] py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-[11px] text-[#6B6256] sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} Nishant Waters. Crafted with intention.
          </p>
          <div className="flex gap-4">
            <button className="text-[11px] text-[#6B6256] underline-offset-2 transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]">
              Privacy
            </button>
            <button className="text-[11px] text-[#6B6256] underline-offset-2 transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;