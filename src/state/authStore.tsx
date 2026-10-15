import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { createId, loadUser, saveUser } from "../mock";
import type { User, AuthCredentials } from "../types";
import { validateEmail, validateRequired } from "../mock";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCKED auth: restore from localStorage
    const stored = loadUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const performLogin = async (credentials: AuthCredentials, isSignup: boolean) => {
    const emailRes = validateEmail(credentials.email);
    const passRes = validateRequired("Password", credentials.password);
    const nameRes = isSignup ? validateRequired("Name", credentials.name || "") : { valid: true };

    const errors: string[] = [];
    if (!emailRes.valid && emailRes.error) errors.push(emailRes.error);
    if (!passRes.valid && passRes.error) errors.push(passRes.error);
    if (!nameRes.valid && nameRes.error) errors.push(nameRes.error);

    if (errors.length) {
      toast.error(errors[0]);
      throw new Error("Validation failed");
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400)); // pretend network delay

    const nextUser: User = {
      id: user?.id ?? createId("user"),
      name: credentials.name || user?.name || "Guest",
      email: credentials.email,
      isLoggedIn: true,
    };

    setUser(nextUser);
    saveUser(nextUser);
    toast.success(isSignup ? "Welcome to Nishant Waters" : "Logged in successfully");
    setLoading(false);
  };

  const login = (credentials: AuthCredentials) => performLogin(credentials, false);

  const signup = (credentials: AuthCredentials) => performLogin(credentials, true);

  const logout = () => {
    setUser(null);
    saveUser({ id: "", name: "", email: "", isLoggedIn: false });
    toast("Signed out");
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Route guard for checkout or account pages
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-neutral-700">
        Restoring your session...
      </div>
    );
  }

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};