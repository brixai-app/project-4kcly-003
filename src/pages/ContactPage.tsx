import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Separator } from "@/components/ui/shadcn";
import { submitContact } from "@/mock";
import { showToastError, showToastSuccess } from "@/components/ToastProvider";

const containerVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Please share your name.";
    }

    if (!email.trim()) {
      nextErrors.email = "An email helps us reply thoughtfully.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "This email doesn’t look quite right.";
    }

    if (!message.trim()) {
      nextErrors.message = "Tell us a little about what you have in mind.";
    } else if (message.trim().length < 12) {
      nextErrors.message = "A touch more detail will help us respond well.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // FRONTEND-ONLY MOCK: this uses a mocked submitContact in src/mock.ts
      const result = await submitContact({ name, email, message });
      if (!result.success) {
        showToastError("We couldn’t send your note", result.message);
        return;
      }

      showToastSuccess("Message sent", result.message ?? "Your message is now with our team.");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch (err) {
      showToastError("Something went wrong", "This is a purely mocked contact flow – please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#f3e6d6)] text-stone-900">
      {/* Hero / Intro */}
      <section className="w-full pt-16 pb-10 md:pb-14 lg:pt-20 lg:pb-16">
        <motion.div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.25em] uppercase text-stone-500 mb-4">Contact</p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 mb-4 font-['Playfair_Display']"
              >
                Quiet conversations,
                <br className="hidden sm:block" /> loud impressions.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-stone-700 max-w-xl">
                Share a sketch of your event, property, or brand, and we&apos;ll help you dress the
                simplest ritual—water—in a label that feels distinctly yours.
              </p>
            </div>
            <div className="lg:text-right space-y-1 text-sm text-stone-600 max-w-sm">
              <p>For collaborations, trade accounts or bespoke formats, write to us directly.</p>
              <p className="font-medium text-stone-800">studio@nishantwaters.com</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Body: form + sidebar */}
      <section className="w-full pb-16 lg:pb-24">
        <motion.div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
          initial="initial"
          animate="animate"
          variants={containerVariants}
          transition={{ delay: 0.05 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)] gap-10 lg:gap-14 items-start">
            {/* Contact form */}
            <motion.div variants={cardVariants} initial="initial" animate="animate">
              <Card className="border border-stone-200/80 bg-[#f7f1e8]/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-stone-900 font-['Playfair_Display']">
                    Begin the conversation
                  </CardTitle>
                  <CardDescription className="text-sm text-stone-600">
                    Tell us about your project, opening, or property. We typically respond within one
                    business day.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs uppercase tracking-[0.2em] text-stone-600"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name or studio"
                        className={`bg-white/80 border-stone-300/80 focus-visible:ring-stone-500/70 focus-visible:border-stone-500/80 rounded-md text-sm ${
                          errors.name ? "border-red-500/70" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 mt-0.5">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs uppercase tracking-[0.2em] text-stone-600"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`bg-white/80 border-stone-300/80 focus-visible:ring-stone-500/70 focus-visible:border-stone-500/80 rounded-md text-sm ${
                          errors.email ? "border-red-500/70" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-xs uppercase tracking-[0.2em] text-stone-600"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share timing, quantities, and any visual references you&apos;re holding in mind."
                        rows={6}
                        className={`resize-none bg-white/80 border-stone-300/80 focus-visible:ring-stone-500/70 focus-visible:border-stone-500/80 rounded-md text-sm leading-relaxed ${
                          errors.message ? "border-red-500/70" : ""
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-600 mt-0.5">{errors.message}</p>
                      )}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <p className="text-xs text-stone-500 max-w-xs">
                        This is a fully frontend mock — your message is stored only in your browser for
                        this Nishant Waters preview experience.
                      </p>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b46a2b] hover:bg-[#914b1a] text-amber-50 px-6 py-2.5 text-sm font-medium tracking-wide shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Sending" : "Send message"}
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar: Address + FAQ */}
            <motion.aside
              className="space-y-6 lg:space-y-8"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.08 }}
            >
              <Card className="border border-stone-200/80 bg-[#f3e6d6]/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-stone-900 font-['Playfair_Display']">
                    Studio details
                  </CardTitle>
                  <CardDescription className="text-xs text-stone-600">
                    A small studio working quietly between hospitality, events, and identity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-stone-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-stone-700" />
                    <div>
                      <p className="font-medium text-stone-900">Nishant Waters Studio</p>
                      <p className="text-stone-700">
                        Brandy House
                        <br />
                        48 Stillwater Lane
                        <br />
                        New York, NY 10013
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-stone-700" />
                    <div>
                      <p className="font-medium text-stone-900">Studio phone</p>
                      <p className="text-stone-700">+1 (212) 555‑0174</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 text-stone-700" />
                    <div>
                      <p className="font-medium text-stone-900">Project enquiries</p>
                      <p className="text-stone-700">studio@nishantwaters.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5 text-stone-700" />
                    <div>
                      <p className="font-medium text-stone-900">Studio hours</p>
                      <p className="text-stone-700">Monday–Friday, 10:00–18:00 EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-stone-200/80 bg-white/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-stone-900 font-['Playfair_Display']">
                    A few quick answers
                  </CardTitle>
                  <CardDescription className="text-xs text-stone-600">
                    A lightweight FAQ to help shape your note.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-stone-700">
                  <div className="space-y-1.5">
                    <p className="font-medium text-stone-900">
                      What is the minimum order quantity?
                    </p>
                    <p className="text-stone-700">
                      Each bottle has a different starting quantity, typically between 12 and 72 units.
                      Share your ideal count and we&apos;ll suggest the best vessel.
                    </p>
                  </div>
                  <Separator className="bg-stone-200/80" />
                  <div className="space-y-1.5">
                    <p className="font-medium text-stone-900">Can you match our brand colors?</p>
                    <p className="text-stone-700">
                      Our warm brandy palette is the starting point. For larger runs, we can work with
                      your existing palette as an extension of the collection.
                    </p>
                  </div>
                  <Separator className="bg-stone-200/80" />
                  <div className="space-y-1.5">
                    <p className="font-medium text-stone-900">Do you ship internationally?</p>
                    <p className="text-stone-700">
                      For this preview, shipping is simulated in your browser. In practice, we partner
                      with logistics teams to coordinate global deliveries.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;