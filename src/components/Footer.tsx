import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Share2, MessageCircle } from "lucide-react";
import { Button, Separator } from "@/components/ui/shadcn";

// NOTE: Purely presentational footer. All data is static on the client.
// This app is 100% frontend-only; any "links" or actions here are mocks.

const footerLinks = {
  explore: [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  social: [
    {
      label: "Studio Journal",
      href: "#",
      icon: Globe,
      aria: "Open Nishant Waters studio journal (mock link)",
    },
    {
      label: "Share Collection",
      href: "#",
      icon: Share2,
      aria: "Share Nishant Waters collection (mock link)",
    },
    {
      label: "Studio Line",
      href: "#",
      icon: MessageCircle,
      aria: "Message Nishant Waters studio (mock link)",
    },
  ],
};

const columnVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: "easeOut" },
  }),
};

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#d5b596]/40 bg-[#f5eee6] text-[#3a271c] dark:bg-[#17110d] dark:text-[#f6ece2] dark:border-[#6e4b32]/60 mt-12">
      <div className="w-full px-6 lg:px-12 py-10 lg:py-12">
        <div className="w-full max-w-[1600px] mx-auto space-y-8">
          {/* Top section: three compact columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand column */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={columnVariants}
              className="flex flex-col gap-3"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg tracking-[0.18em] uppercase text-[#b06a3b] dark:text-[#e3b087]">
                  Nishant
                </span>
                <span className="text-lg tracking-[0.18em] uppercase text-[#7b4c2f] dark:text-[#f6ece2]">
                  Waters
                </span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#5b4333]/90 dark:text-[#f6ece2]/75">
                Custom-labeled water for dining rooms, studios, and spaces that treat every detail as part of the story.
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c6850] dark:text-[#c79a76]">
                Still · Sparkling · Mineral
              </p>
            </motion.div>

            {/* Explore column */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={columnVariants}
              className="flex flex-col gap-3"
            >
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8c6850] dark:text-[#c79a76]">
                Explore
              </h2>
              <nav className="flex flex-col gap-1.5" aria-label="Footer navigation">
                {footerLinks.explore.map(link => (
                  <Button
                    key={link.label}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="justify-start px-0 text-sm font-normal text-[#3f2a23] hover:text-[#b06a3b] hover:bg-[#e8dacb] focus-visible:ring-2 focus-visible:ring-[#b06a3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5eee6] dark:text-[#f6ece2] dark:hover:text-[#f0d2b1] dark:hover:bg-[#24140d] dark:focus-visible:ring-offset-[#17110d]"
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </motion.div>

            {/* Social column */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={columnVariants}
              className="flex flex-col gap-3"
            >
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8c6850] dark:text-[#c79a76]">
                Studio & Social
              </h2>
              <div className="flex flex-col gap-1.5">
                {footerLinks.social.map(link => (
                  <Button
                    key={link.label}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="group justify-between px-0 text-sm font-normal text-[#3f2a23] hover:text-[#b06a3b] hover:bg-[#e8dacb] focus-visible:ring-2 focus-visible:ring-[#b06a3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5eee6] dark:text-[#f6ece2] dark:hover:text-[#f0d2b1] dark:hover:bg-[#24140d] dark:focus-visible:ring-offset-[#17110d]"
                  >
                    <a href={link.href} aria-label={link.aria}>
                      <span className="flex items-center gap-2">
                        <link.icon className="h-4 w-4 text-[#b06a3b] group-hover:text-[#8d5127] dark:text-[#e3b087] dark:group-hover:text-[#f6ece2] transition-colors" />
                        <span>{link.label}</span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 translate-y-0.5 group-hover:-translate-y-0 transition-opacity transition-transform duration-200" />
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>

          <Separator className="border-[#d5b596]/60 dark:border-[#6e4b32]/70" />

          {/* Bottom bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#5b4333]/90 dark:text-[#f6ece2]/70">
            <p>
              © {year} Nishant Waters. Crafted as a frontend-only mock experience — no backend, no real orders placed.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                type="button"
                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5eee6] dark:focus-visible:ring-offset-[#17110d]"
              >
                Studio imprint
              </button>
              <span className="hidden sm:inline text-[#8c6850] dark:text-[#c79a76]">·</span>
              <button
                type="button"
                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a3b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5eee6] dark:focus-visible:ring-offset-[#17110d]"
              >
                Mock privacy note
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;