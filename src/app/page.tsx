"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CountrySelector from "@/components/CountrySelector";
import ProductCard from "@/components/ProductCard";
import { getPopularProducts } from "@/lib/products";
import {
  Globe,
  Sparkles,
  TrendingDown,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const router = useRouter();
  const popularProducts = getPopularProducts(selectedCountry);

  const handleSearch = (query: string) => {
    router.push(
      `/search?q=${encodeURIComponent(query)}&country=${selectedCountry}`
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Price Comparison
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Find the <span className="text-yellow-300">Best Price</span>
            <br />
            Across All Stores
          </h1>

          <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
            Compare prices from multiple merchants in your country. Our AI
            analyzes deals to find you the best value.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} large />
          </div>

          {/* Country Selector */}
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-indigo-200 mb-3 flex items-center justify-center gap-2">
              <Globe className="h-4 w-4" />
              Select your country to see local prices
            </p>
            <CountrySelector
              selected={selectedCountry}
              onChange={setSelectedCountry}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingDown,
              title: "Best Prices",
              desc: "Compare across all major merchants in your region",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: Sparkles,
              title: "AI Analysis",
              desc: "Smart recommendations considering price, delivery & ratings",
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              icon: Shield,
              title: "Trusted Stores",
              desc: "Only verified and reputable ecommerce merchants",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4"
            >
              <div className={`${feature.bg} p-3 rounded-xl`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Comparisons
            </h2>
            <p className="text-gray-500 mt-1">
              Trending products with the best price differences
            </p>
          </div>
          <button
            onClick={() => handleSearch("popular")}
            className="hidden sm:flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              country={selectedCountry}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            PriceWise - Smart Ecommerce Price Comparison. Prices are indicative
            and may vary.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Built with Next.js, Tailwind CSS, and AI
          </p>
        </div>
      </footer>
    </div>
  );
}
