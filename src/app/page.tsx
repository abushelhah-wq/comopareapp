"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CountrySelector from "@/components/CountrySelector";
import TrendingSection from "@/components/TrendingSection";
import {
  Globe,
  Sparkles,
  TrendingDown,
  Shield,
  Gamepad2,
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Tablet,
  Watch,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "Gaming", icon: Gamepad2, query: "PS5 console", color: "bg-blue-500" },
  { name: "Phones", icon: Smartphone, query: "iPhone 16 Pro", color: "bg-purple-500" },
  { name: "Laptops", icon: Laptop, query: "MacBook Pro", color: "bg-gray-700" },
  { name: "Audio", icon: Headphones, query: "AirPods Pro", color: "bg-orange-500" },
  { name: "TVs", icon: Tv, query: "Samsung 65 inch TV", color: "bg-teal-500" },
  { name: "Tablets", icon: Tablet, query: "iPad Pro", color: "bg-indigo-500" },
  { name: "Wearables", icon: Watch, query: "Apple Watch", color: "bg-rose-500" },
  { name: "More", icon: ShoppingBag, query: "Nike Air Jordan", color: "bg-green-600" },
];

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(
      `/search?q=${encodeURIComponent(query)}&country=${selectedCountry}`
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden">
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
            Search for <strong className="text-white">any product</strong> and our AI will compare
            prices across merchants in your country instantly.
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
              title: "AI-Powered Search",
              desc: "Search for any product — our AI finds and compares prices",
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

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Browse by Category
          </h2>
          <p className="text-gray-500 mt-1">
            Click any category to compare prices across merchants
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleSearch(cat.query)}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div
                className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Compare prices</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <TrendingSection country={selectedCountry} />

      {/* How it Works */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Search Any Product",
                desc: "Type any product name — from PS5 to Nike shoes to coffee machines. Our AI understands what you're looking for.",
              },
              {
                step: "2",
                title: "Compare Prices",
                desc: "See prices from all major merchants in your selected country, side by side with delivery info and ratings.",
              },
              {
                step: "3",
                title: "Get AI Insights",
                desc: "Our AI analyzes the results and recommends the best deal based on price, delivery speed, and store reliability.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            PriceWise - AI-Powered Ecommerce Price Comparison. Prices are
            AI-estimated and may vary from actual store prices.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Built with Next.js, Tailwind CSS, and Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
