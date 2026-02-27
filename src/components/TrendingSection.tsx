"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Sparkles,
  Loader2,
  ArrowRight,
  Flame,
} from "lucide-react";

interface TrendingItem {
  rank: number;
  name: string;
  category: string;
  searchQuery: string;
  reason: string;
  priceRange: string;
  emoji: string;
}

interface TrendingData {
  country: { name: string; flag: string; currency: string };
  trends: TrendingItem[];
  updatedAt: string;
}

interface TrendingSectionProps {
  country: string;
}

export default function TrendingSection({ country }: TrendingSectionProps) {
  const [data, setData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`/api/trending?country=${country}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(true);
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [country]);

  const handleClick = (searchQuery: string) => {
    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}&country=${country}`
    );
  };

  if (error) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2.5 rounded-xl">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Trending in {data?.country?.flag} {data?.country?.name || "..."}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Most searched products right now
            </p>
          </div>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-indigo-500 text-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI analyzing trends...</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trending Items */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.trends.map((item) => (
            <button
              key={item.rank}
              onClick={() => handleClick(item.searchQuery)}
              className="group bg-white rounded-xl border border-gray-100 p-4 text-left hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Rank + Emoji */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                      item.rank <= 3
                        ? "bg-gradient-to-br from-orange-400 to-red-500"
                        : "bg-gray-100"
                    }`}
                  >
                    {item.rank <= 3 ? (
                      <span className="text-sm">{item.emoji}</span>
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {item.rank}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.reason}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.priceRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="flex items-center gap-1 mt-3 text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="h-3 w-3" />
                Compare prices
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
