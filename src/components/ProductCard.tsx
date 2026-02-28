"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  Tag,
  TrendingDown,
  Store,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  country: string;
}

export default function ProductCard({ product, country }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.image && product.image.startsWith("http");
  const inStockListings = product.listings.filter((l) => l.inStock);
  const cheapest = inStockListings[0];
  const mostExpensive = inStockListings[inStockListings.length - 1];

  if (!cheapest) return null;

  const savingsPercent =
    mostExpensive && cheapest
      ? Math.round(
          ((mostExpensive.price - cheapest.price) / mostExpensive.price) * 100
        )
      : 0;

  // Generate a gradient based on product category
  const categoryColors: Record<string, string> = {
    Gaming: "from-blue-500 to-indigo-600",
    Phones: "from-purple-500 to-pink-600",
    Laptops: "from-gray-600 to-gray-800",
    Audio: "from-orange-500 to-red-600",
    TVs: "from-teal-500 to-cyan-600",
    Tablets: "from-indigo-500 to-purple-600",
    Wearables: "from-rose-500 to-pink-600",
  };

  const gradient = categoryColors[product.category] || "from-gray-500 to-gray-700";

  return (
    <Link
      href={`/product/${product.id}?country=${country}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Product Image Area */}
      <div
        className={`relative h-48 ${hasImage && !imgError ? "bg-white" : `bg-gradient-to-br ${gradient}`} flex items-center justify-center p-6`}
      >
        {hasImage && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-white text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium opacity-60">{product.category}</p>
          </div>
        )}

        {/* Savings Badge */}
        {savingsPercent > 5 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            Save {savingsPercent}%
          </div>
        )}

        {/* Brand Badge */}
        <div className={`absolute top-3 left-3 ${hasImage && !imgError ? "bg-black/60" : "bg-black/30"} backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full`}>
          {product.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Price Range */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-indigo-600">
            {cheapest.currencySymbol} {cheapest.price.toLocaleString()}
          </span>
          {cheapest.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {cheapest.currencySymbol}{" "}
              {cheapest.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Merchant Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Store className="h-4 w-4" />
            <span>
              {inStockListings.length} merchant
              {inStockListings.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Tag className="h-4 w-4" />
            <span>Compare prices</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
