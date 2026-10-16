import React from "react";
import { Link } from "react-router-dom";
import type { Product, CartItem } from "@/mock";

export type HomePageProps = {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
};

const HomePage: React.FC<HomePageProps> = ({ products, onAddToCart }) => {
  const handleQuickAdd = (product: Product) => {
    const item: CartItem = {
      id: `${product.id}-default`,
      productId: product.id,
      quantity: 1,
    };
    onAddToCart(item);
  };

  return (
    <div className="px-6 py-10 space-y-12">
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1F130C]">
            Craft Cold Brew, Delivered.
          </h1>
          <p className="text-sm md:text-base text-[#4A3B2A] max-w-xl">
            Discover small-batch, slow-steeped cold brew with customizable
            bottles and labels. Designed for coffee lovers who savor every
            detail.
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              to="/shop"
              className="rounded-full bg-[#CBA135] px-5 py-2 text-sm font-medium text-[#1F130C] hover:bg-[#e0b948] transition-colors"
            >
              Shop the Collection
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-[#CBA135] px-5 py-2 text-sm font-medium text-[#1F130C] hover:bg-[#1F130C] hover:text-[#FFF5E1] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 2).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleQuickAdd(product)}
              className="flex flex-col items-start rounded-3xl bg-white/80 px-4 py-5 text-left shadow-sm hover:shadow-lg transition-shadow border border-[#F2E1C2]"
            >
              <div className="h-32 w-full rounded-2xl bg-[#EAD3B0] mb-3 overflow-hidden">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-sm font-semibold text-[#1F130C]">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-[#4A3B2A] line-clamp-2">
                {product.description}
              </p>
              <p className="mt-2 text-sm font-medium text-[#1F130C]">
                ${product.price.toFixed(2)}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-[#1F130C] px-3 py-1 text-[11px] font-medium text-[#FFF5E1]">
                Quick add
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;