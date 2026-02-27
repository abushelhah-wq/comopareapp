"use client";

import { useState, FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  loading?: boolean;
  large?: boolean;
}

export default function SearchBar({
  onSearch,
  initialQuery = "",
  loading = false,
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    "PS5",
    "iPhone 16",
    "MacBook Pro",
    "AirPods Pro",
    "Samsung Galaxy S24",
    "Xbox Series X",
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center ${
            large ? "text-lg" : "text-base"
          }`}
        >
          <Search
            className={`absolute left-4 text-gray-400 ${
              large ? "h-6 w-6" : "h-5 w-5"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any product... (e.g., PS5, iPhone 16, MacBook)"
            className={`w-full bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all ${
              large ? "pl-14 pr-36 py-5" : "pl-12 pr-28 py-3"
            }`}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`absolute right-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${
              large ? "px-8 py-3 text-base" : "px-6 py-2 text-sm"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
      {large && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <span className="text-sm text-gray-400">Popular:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSearch(s);
              }}
              className="text-sm px-3 py-1 bg-white/80 border border-gray-200 rounded-full text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
