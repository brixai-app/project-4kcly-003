import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E4D0B8] bg-[#FFF5E1]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-[0.25em] text-[#333333] font-['Playfair_Display']">
              NISHANT
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#A0522D] uppercase">
              Waters
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-[#5C4B42]">
            Custom-labelled waters for evenings that linger. Crafted in warm brandy tones,
            designed to disappear into candlelight.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm md:flex-row md:items-end md:gap-10">
          <nav className="flex gap-4 text-xs uppercase tracking-wide text-[#4b3b32]">
            <Link
              to="/shop"
              className="transition-colors duration-150 hover:text-[#A0522D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="transition-colors duration-150 hover:text-[#A0522D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="transition-colors duration-150 hover:text-[#A0522D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Open Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D2B48C]/70 bg-white text-[#4b3b32] shadow-sm transition-colors duration-150 hover:bg-[#FFF0D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
              >
                <Instagram className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Open Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D2B48C]/70 bg-white text-[#4b3b32] shadow-sm transition-colors duration-150 hover:bg-[#FFF0D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Open LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D2B48C]/70 bg-white text-[#4b3b32] shadow-sm transition-colors duration-150 hover:bg-[#FFF0D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
              >
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8A6C5A]">
              © {new Date().getFullYear()} Nishant Waters. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;