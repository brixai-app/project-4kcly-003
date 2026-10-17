import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  Button,
  Separator,
} from "@/components/ui/shadcn";

export interface ContactPageProps {}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    setIsSubmitting(true);

    // Purely mocked submit for this frontend-only MVP – no backend is called.
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent");
      setName("");
      setEmail("");
      setMessage("");
    }, 700);
  };

  return (
    <main className="w-full min-h-screen bg-[rgb(20,15,11)] text-[rgb(245,237,228)]">
      {/* Full-bleed banner */}
      <section className="w-full min-h-[55vh] relative overflow-hidden bg-gradient-to-br from-[rgb(44,30,22)] via-[rgb(28,20,15)] to-[rgb(20,14,10)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" aria-hidden="true">
          <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(213,151,93,0.55),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(120,74,43,0.85),_transparent_65%)]" />
        </div>
        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row gap-12 lg:gap-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 max-w-2xl"
          >
            <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-[rgba(245,237,228,0.7)] mb-4">
              Contact
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl leading-tight text-[rgb(244,226,207)] mb-6">
              A quiet conversation
              <br className="hidden md:block" /> about water.
            </h1>
            <p className="text-sm md:text-base text-[rgba(245,237,228,0.8)] max-w-xl">
              Share a menu, a moodboard, or simply a date. Nishant Waters is built for
              dining rooms, studios, and openings that think in textures and light.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
            className="flex-1 max-w-md"
          >
            <div className="border border-[rgba(245,237,228,0.12)] bg-[rgba(23,16,12,0.9)]/90 backdrop-blur-md rounded-xl p-5 md:p-6 shadow-[0_22px_45px_rgba(0,0,0,0.55)]">
              <p className="text-xs tracking-[0.2em] uppercase text-[rgba(245,237,228,0.7)] mb-4">
                Studio dispatch
              </p>
              <p className="text-sm text-[rgba(245,237,228,0.85)]">
                We respond thoughtfully to every note. For launches, collaborations, or
                custom runs, include timelines and any references you love.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content section */}
      <section className="w-full py-14 md:py-20 bg-[rgb(18,13,10)]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-[1.1] w-full"
          >
            <Card className="bg-[rgb(24,17,13)] border-[rgba(245,237,228,0.12)] shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="font-['Playfair_Display'] text-2xl md:text-3xl text-[rgb(244,226,207)]">
                  Tell us about your table
                </CardTitle>
                <CardDescription className="text-[rgba(245,237,228,0.7)] text-sm md:text-base">
                  This is a mock contact form for the frontend-only experience. No email is
                  actually sent, but your message is handled entirely in the browser.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-[rgba(245,237,228,0.08)]" />
              <CardContent className="pt-6 md:pt-8">
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium tracking-[0.18em] uppercase text-[rgba(245,237,228,0.75)]"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="How should we address you?"
                      className="bg-[rgb(18,13,10)] border-[rgba(245,237,228,0.28)]/70 focus-visible:border-[rgb(199,137,86)] focus-visible:ring-[rgb(199,137,86)] text-[rgb(245,237,228)] placeholder:text-[rgba(245,237,228,0.45)] rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium tracking-[0.18em] uppercase text-[rgba(245,237,228,0.75)]"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="studio@yourspace.com"
                      className="bg-[rgb(18,13,10)] border-[rgba(245,237,228,0.28)]/70 focus-visible:border-[rgb(199,137,86)] focus-visible:ring-[rgb(199,137,86)] text-[rgb(245,237,228)] placeholder:text-[rgba(245,237,228,0.45)] rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-xs font-medium tracking-[0.18em] uppercase text-[rgba(245,237,228,0.75)]"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Share your setting, event date, quantities, or anything you feel matters."
                      rows={6}
                      className="bg-[rgb(18,13,10)] border-[rgba(245,237,228,0.28)]/70 focus-visible:border-[rgb(199,137,86)] focus-visible:ring-[rgb(199,137,86)] text-[rgb(245,237,228)] placeholder:text-[rgba(245,237,228,0.45)] rounded-lg resize-y min-h-[160px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[rgb(181,106,60)] text-[rgb(24,15,11)] text-sm font-medium tracking-[0.16em] uppercase hover:bg-[rgb(199,137,86)] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSubmitting ? "Sending" : "Send message"}
                    </Button>
                    <p className="text-[11px] text-[rgba(245,237,228,0.6)] max-w-xs">
                      We keep correspondence minimal and considered. This interaction is fully
                      mocked and stored only in your browser.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact details */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="space-y-6 md:space-y-7">
              <div>
                <p className="uppercase tracking-[0.22em] text-[11px] text-[rgba(245,237,228,0.65)] mb-2">
                  Studio
                </p>
                <h2 className="font-['Playfair_Display'] text-xl md:text-2xl text-[rgb(244,226,207)] mb-3">
                  Nishant Waters Studio
                </h2>
                <p className="text-sm text-[rgba(245,237,228,0.78)] max-w-sm">
                  Built as a frontend-only mock, Nishant Waters keeps every interaction on your
                  device. Imagine this as the quiet inbox where projects begin.
                </p>
              </div>

              <Separator className="bg-[rgba(245,237,228,0.08)]" />

              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-[rgba(181,106,60,0.12)] border border-[rgba(181,106,60,0.4)] p-2 text-[rgb(230,205,183)]">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[rgba(245,237,228,0.7)] mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:studio@nishantwaters.mock"
                      className="text-sm text-[rgb(240,216,192)] hover:text-[rgb(212,164,113)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(199,137,86)] rounded-sm"
                    >
                      studio@nishantwaters.mock
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-[rgba(181,106,60,0.12)] border border-[rgba(181,106,60,0.4)] p-2 text-[rgb(230,205,183)]">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[rgba(245,237,228,0.7)] mb-1">
                      Studio line
                    </p>
                    <p className="text-sm text-[rgba(245,237,228,0.8)]">
                      +1 (000) 000-0000
                    </p>
                    <p className="text-[11px] text-[rgba(245,237,228,0.6)] mt-1">
                      Weekdays, 10:00–16:00 PST
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-[rgba(181,106,60,0.12)] border border-[rgba(181,106,60,0.4)] p-2 text-[rgb(230,205,183)]">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[rgba(245,237,228,0.7)] mb-1">
                      Correspondence
                    </p>
                    <p className="text-sm text-[rgba(245,237,228,0.8)] leading-relaxed">
                      14 Brandy Lane
                      <br />
                      Warmth City, CA 00000
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-[rgba(245,237,228,0.08)]" />

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgba(245,237,228,0.6)]">
                  Response cadence
                </p>
                <p className="text-[11px] text-[rgba(245,237,228,0.7)] max-w-sm">
                  As this is a fully mocked frontend experience, responses are imagined only.
                  In a live studio setting we typically reply within 1–2 business days.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;