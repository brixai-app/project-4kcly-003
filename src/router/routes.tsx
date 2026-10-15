import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderConfirmationPage } from "@/pages/OrderConfirmationPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { AuthPage } from "@/pages/AuthPage";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuthStore } from "@/state/authStore";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user?.isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: { pathname: location.pathname } }}
      />
    );
  }

  return children;
};

const withTransition = (element: React.ReactElement) => (
  <PageTransition>{element}</PageTransition>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withTransition(<HomePage />)} />
        <Route path="/shop" element={withTransition(<ShopPage />)} />
        <Route
          path="/product/:id"
          element={withTransition(<ProductDetailPage />)}
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>{withTransition(<CheckoutPage />)}</RequireAuth>
          }
        />
        <Route
          path="/checkout/confirmation"
          element={
            <RequireAuth>{withTransition(<OrderConfirmationPage />)}</RequireAuth>
          }
        />
        <Route path="/about" element={withTransition(<AboutPage />)} />
        <Route path="/contact" element={withTransition(<ContactPage />)} />
        <Route path="/auth" element={withTransition(<AuthPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;