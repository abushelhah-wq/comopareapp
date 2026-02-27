"use client";

import Link from "next/link";
import { Scale, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                PriceWise
              </h1>
              <p className="text-[10px] text-indigo-200 -mt-1">
                Smart Price Comparison
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-indigo-200 text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI-Powered Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}
