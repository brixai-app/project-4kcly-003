import React from "react";
import type { Product } from "@/mock";
import { Link } from "react-router-dom";

export type ShopPageProps = {
  products: Product[];
};

const ShopPage: React.FC<ShopPageProps> = ({ products }) => {
  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold text-[#1F130C] mb-6">
        Shop Cold Brew
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex flex-col rounded-3xl bg-white/80 p-4 shadow-sm hover:shadow-lg transition-shadow border border-[#F2E1C2]"
          >
            <div className="h-40 w-full rounded-2xl bg-[#EAD3B0] mb-3 overflow-hidden">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;