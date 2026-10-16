import React from "react";
import { useParams } from "react-router-dom";
import type { Product, CartItem } from "@/mock";

export type ProductDetailPageProps = {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  products,
  onAddToCart,
}) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="px-6 py-10">
        <p className="text-sm text-[#4A3B2A]">Product not found.</p>
      </div>
    );
  }

  const handleAdd = () => {
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      quantity: 1,
    };
    onAddToCart(item);
  };

  return (
    <div className="px-6 py-10 grid gap-8 md:grid-cols-2 items-start">
      <div className="h-64 w-full rounded-3xl bg-[#EAD3B0] overflow-hidden">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1F130C]">
          {product.name}
        </h1>
        <p className="text-sm text-[#4A3B2A] max-w-prose">
          {product.description}
        </p>
        <p className="text-lg font-medium text-[#1F130C]">
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 inline-flex rounded-full bg-[#CBA135] px-5 py-2 text-sm font-medium text-[#1F130C] hover:bg-[#e0b948] transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;