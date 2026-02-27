"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import ComparisonTable from "@/components/ComparisonTable";
import AIInsightPanel from "@/components/AIInsightPanel";
import CountrySelector from "@/components/CountrySelector";
import SearchBar from "@/components/SearchBar";
import {
  ArrowLeft,
  ShoppingCart,
  Globe,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function ProductContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = params.id as string;
  const countryCode = searchParams.get("country") || "SA";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countryCode);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/search?q=${encodeURIComponent(productId)}&country=${selectedCountry}`
    )
      .then((res) => res.json())
      .then((data) => {
        const found = data.products?.find(
          (p: Product) => p.id === productId
        );
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, selectedCountry]);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    router.push(`/product/${productId}?country=${code}`);
  };

  const handleSearch = (query: string) => {
    router.push(
      `/search?q=${encodeURIComponent(query)}&country=${selectedCountry}`
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
        <p className="text-gray-500">Loading product comparison...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Product not found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you&apos;re looking for doesn&apos;t exist or is
          unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  const inStockCount = product.listings.filter((l) => l.inStock).length;
  const cheapest = product.listings.find((l) => l.inStock);
  const mostExpensive = [...product.listings]
    .filter((l) => l.inStock)
    .sort((a, b) => b.price - a.price)[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <Link
          href={`/search?q=${encodeURIComponent(product.name)}&country=${selectedCountry}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>
        <div className="flex items-center gap-3">
          <SearchBar onSearch={handleSearch} />
          <CountrySelector
            selected={selectedCountry}
            onChange={handleCountryChange}
            compact
          />
        </div>
      </div>

      {/* Product Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image Placeholder */}
          <div className="flex-shrink-0 w-full sm:w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-indigo-300" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                  {product.name}
                </h1>
                <p className="text-gray-500 mt-1">{product.brand}</p>
              </div>
            </div>

            <p className="text-gray-600 mt-3 text-sm">{product.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Lowest Price</p>
                <p className="text-lg font-bold text-green-600">
                  {cheapest
                    ? `${cheapest.currencySymbol} ${cheapest.price.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Highest Price</p>
                <p className="text-lg font-bold text-gray-700">
                  {mostExpensive
                    ? `${mostExpensive.currencySymbol} ${mostExpensive.price.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Merchants</p>
                <p className="text-lg font-bold text-indigo-600">
                  {inStockCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">You Save</p>
                <p className="text-lg font-bold text-green-600">
                  {cheapest && mostExpensive
                    ? `${cheapest.currencySymbol} ${Math.round(
                        mostExpensive.price - cheapest.price
                      ).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="mb-6">
        <AIInsightPanel productId={productId} country={selectedCountry} />
      </div>

      {/* Price Comparison Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Price Comparison
          </h2>
          <span className="text-sm text-gray-400 ml-2">
            across {product.listings.length} merchants
          </span>
        </div>
        <ComparisonTable listings={product.listings} />
      </div>

      {/* Country Change Prompt */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 text-center">
        <Globe className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Compare in a different country?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          See how prices differ across regions
        </p>
        <div className="max-w-2xl mx-auto">
          <CountrySelector
            selected={selectedCountry}
            onChange={handleCountryChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading product comparison...</p>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}
