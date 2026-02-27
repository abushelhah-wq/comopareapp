"use client";

import { countries } from "@/lib/countries";
import { ChevronDown } from "lucide-react";

interface CountrySelectorProps {
  selected: string;
  onChange: (code: string) => void;
  compact?: boolean;
}

export default function CountrySelector({
  selected,
  onChange,
  compact = false,
}: CountrySelectorProps) {
  const selectedCountry = countries.find((c) => c.code === selected);

  if (compact) {
    return (
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
        >
          {countries.map((country) => (
            <option
              key={country.code}
              value={country.code}
              className="text-gray-900"
            >
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {countries.map((country) => (
        <button
          key={country.code}
          onClick={() => onChange(country.code)}
          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
            selected === country.code
              ? "border-indigo-500 bg-indigo-50 shadow-md"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
          }`}
        >
          <span className="text-2xl">{country.flag}</span>
          <div className="text-left">
            <p
              className={`text-sm font-medium ${
                selected === country.code
                  ? "text-indigo-700"
                  : "text-gray-700"
              }`}
            >
              {country.name}
            </p>
            <p className="text-xs text-gray-400">{country.currency}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
