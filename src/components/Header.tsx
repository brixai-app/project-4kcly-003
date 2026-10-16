import React from "react";
import { Link } from "react-router-dom";

export type HeaderProps = {
  cartCount: number;
  onCartClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#1F130C] text-[#FFF5E1]">
      <Link to="/" className="text-xl font-semibold tracking-wide">
        Brew Boutique
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link to="/shop" className="hover:text-[#CBA135] transition-colors">
          Shop
        </Link>
        <Link to="/about" className="hover:text-[#CBA135] transition-colors">
          About
        </Link>
        <Link to="/contact" className="hover:text-[#CBA135] transition-colors">
          Contact
        </Link>
        <button
          type="button"
          onClick={onCartClick}
          className="relative rounded-full border border-[#CBA135] px-3 py-1 text-xs font-medium hover:bg-[#CBA135] hover:text-[#1F130C] transition-colors"
        >
          Cart
          {cartCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#CBA135] px-1 text-[11px] text-[#1F130C]">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;