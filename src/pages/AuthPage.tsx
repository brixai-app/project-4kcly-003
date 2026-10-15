import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { DocumentTitle } from "@/components/seo/DocumentTitle";
import { MotionButton } from "@/components/ui/MotionButton";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/state/authStore";
import { toast } from "sonner";

interface LocationState {
  from?: { pathname: string };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const user = useAuthStore((s) => s.user);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  useEffect(() => {
    if (user?.isLoggedIn) {
      const target = state?.from?.pathname || "/";
      navigate(target, { replace: true });
    }
  }, [user, navigate, state]);

  const validate = () => {
    const next: typeof errors = {};
    if (mode === "signup" && !name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!emailRegex.test(email)) next.email = "Enter a valid email";
    if (!password.trim()) next.password = "Password is required";
    else if (password.length < 6) next.password = "At least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setIsSubmitting(true);
    // Client-side mock auth only – no backend or real credentials
    window.setTimeout(() => {
      if (mode === "login") {
        login({ email });
        toast.success("Logged in (mock)");
      } else {
        signup({ name: name.trim(), email });
        toast.success("Account created (mock)");
      }
      setIsSubmitting(false);
    }, 800);
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setErrors({});
  };

  return (
    <>
      <DocumentTitle
        title={mode === "login" ? "Sign in" : "Create account"}
        description="Mock sign-in and sign-up for Nishant Waters to save your cart and checkout experience locally."
      />
      <div className="min-h-screen bg-[#FFF8F0] text-[#3B2A23] flex items-stretch pb-10">
        <div className="hidden lg:block w-2/5 relative overflow-hidden bg-gradient-to-br from-[#F4E1D2] to-[#FFF8F0]">
          <div className="absolute inset-10 rounded-3xl bg-[url('https://images.pexels.com/photos/3654775/pexels-photo-3654775.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center shadow-2xl shadow-[#a0522d33]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B2A23]/70 via-transparent to-transparent" />
          <div className="absolute bottom-16 left-16 right-8 text-[#FFF8F0] space-y-2">
            <p className="font-['Inter'] text-xs uppercase tracking-[0.3em]">
              Nishant Waters
            </p>
            <p className="font-['Playfair_Display'] text-3xl leading-snug">
              A calm, mock-first way to explore custom water bottle design.
            </p>
          </div>
        </div>
        <Container className="flex-1 flex items-center justify-center pt-16 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md bg-[#FFF8F0] border border-[#E0C8B6] rounded-3xl shadow-lg shadow-[#b88a6a33] p-6 sm:p-8"
          >
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#A0522D]/80 mb-2">
                {mode === "login" ? "Welcome back" : "Create account"}
              </p>
              <h1 className="font-['Playfair_Display'] text-3xl text-[#3B2A23] mb-2">
                {mode === "login" ? "Sign in to continue" : "Design with your own profile"}
              </h1>
              <p className="font-['Inter'] text-xs text-[#7a5b48] max-w-sm">
                This is a client-side mock auth system. Your session is stored in
                localStorage only. No real accounts are created.
              </p>
            </div>

            <div className="flex gap-2 mb-6" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-['Inter'] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-[#FFF8F0] ${
                  mode === "login"
                    ? "bg-[#A0522D] text-[#FFF8F0] border-transparent"
                    : "bg-transparent text-[#3B2A23] border-[#E0C8B6] hover:bg-[#F4E1D2]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-['Inter'] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-[#FFF8F0] ${
                  mode === "signup"
                    ? "bg-[#A0522D] text-[#FFF8F0] border-transparent"
                    : "bg-transparent text-[#3B2A23] border-[#E0C8B6] hover:bg-[#F4E1D2]"
                }`}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === "signup" && (
                <Field label="Name" htmlFor="auth-name" error={errors.name}>
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40"
                  />
                </Field>
              )}

              <Field label="Email" htmlFor="auth-email" error={errors.email}>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40"
                />
              </Field>

              <Field label="Password" htmlFor="auth-password" error={errors.password}>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40"
                />
              </Field>

              <div className="pt-2">
                <MotionButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A0522D] text-[#FFF8F0] hover:bg-[#8c4626] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 rounded-full text-sm font-['Inter'] shadow-md shadow-[#a0522d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-[#FFF8F0]"
                >
                  {isSubmitting
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "login"
                    ? "Sign in"
                    : "Sign up"}
                </MotionButton>
              </div>

              <p className="mt-2 text-[11px] text-[#7a5b48] font-['Inter'] leading-relaxed">
                By continuing you acknowledge this is a mock experience only.
                Credentials are stored locally in your browser and do not touch a
                real server.
              </p>
            </form>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default AuthPage;