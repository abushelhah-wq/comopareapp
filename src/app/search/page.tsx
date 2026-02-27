"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CountrySelector from "@/components/CountrySelector";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { Country } from "@/types";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const countryCode = searchParams.get("country") || "SA";

  const [products, setProducts] = useState<Product[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCode);
  const [sortBy, setSortBy] = useState<"price" | "merchants" | "savings">(
    "price"
  );

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}&country=${selectedCountry}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCountry(data.country || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCountry]);

  const handleSearch = (newQuery: string) => {
    router.push(
      `/search?q=${encodeURIComponent(newQuery)}&country=${selectedCountry}`
    );
  };

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    router.push(`/search?q=${encodeURIComponent(query)}&country=${code}`);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price") {
      const aMin = Math.min(...a.listings.filter(l => l.inStock).map((l) => l.price));
      const bMin = Math.min(...b.listings.filter(l => l.inStock).map((l) => l.price));
      return aMin - bMin;
    }
    if (sortBy === "merchants") {
      return b.listings.length - a.listings.length;
    }
    // savings
    const getSavings = (p: Product) => {
      const prices = p.listings.filter(l => l.inStock).map((l) => l.price);
      if (prices.length < 2) return 0;
      return Math.max(...prices) - Math.min(...prices);
    };
    return getSavings(b) - getSavings(a);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <SearchBar
              onSearch={handleSearch}
              initialQuery={query}
              loading={loading}
            />
          </div>
          <CountrySelector
            selected={selectedCountry}
            onChange={handleCountryChange}
            compact
          />
        </div>
      </div>

      {/* Results Info */}
      {query && !loading && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {products.length}
              </span>{" "}
              result{products.length !== 1 ? "s" : ""} for &ldquo;
              <span className="font-medium">{query}</span>&rdquo;
              {country && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-medium">
                    {country.flag} {country.name}
                  </span>
                </span>
              )}
            </p>
          </div>

          {products.length > 1 && (
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
              >
                <option value="price">Sort by: Lowest Price</option>
                <option value="savings">Sort by: Biggest Savings</option>
                <option value="merchants">Sort by: Most Merchants</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              country={selectedCountry}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query && products.length === 0 && (
        <div className="text-center py-20">
          <PackageX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn&apos;t find any products matching &ldquo;{query}&rdquo; in{" "}
            {country?.name || "this country"}. Try a different search term or
            country.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["PS5", "iPhone", "MacBook", "Samsung", "AirPods"].map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                Try &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
