import React, { createContext, useContext, useState } from "react";

export type QuickViewState = {
  isOpen: boolean;
  productId: string | null;
};

export type UIContextValue = {
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  labelDesignerOpen: boolean;
  setLabelDesignerOpen: (open: boolean) => void;
  quickView: QuickViewState;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  activeOverlays: string[];
  registerOverlay: (id: string) => void;
  unregisterOverlay: (id: string) => void;
  topOverlayId: string | null;
};

const UIContext = createContext<UIContextValue | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [labelDesignerOpen, setLabelDesignerOpen] = useState(false);
  const [quickView, setQuickView] = useState<QuickViewState>({ isOpen: false, productId: null });
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);

  const openQuickView = (productId: string) => {
    setQuickView({ isOpen: true, productId });
    registerOverlay("quick-view");
  };

  const closeQuickView = () => {
    setQuickView({ isOpen: false, productId: null });
    unregisterOverlay("quick-view");
  };

  const registerOverlay = (id: string) => {
    setActiveOverlays((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const unregisterOverlay = (id: string) => {
    setActiveOverlays((prev) => prev.filter((x) => x !== id));
  };

  const topOverlayId = activeOverlays.length > 0 ? activeOverlays[activeOverlays.length - 1] : null;

  const value: UIContextValue = {
    cartDrawerOpen,
    setCartDrawerOpen,
    labelDesignerOpen,
    setLabelDesignerOpen,
    quickView,
    openQuickView,
    closeQuickView,
    activeOverlays,
    registerOverlay,
    unregisterOverlay,
    topOverlayId,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return ctx;
}