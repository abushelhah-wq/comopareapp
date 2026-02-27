"use client";

import { useEffect, useState } from "react";
import { AIAnalysis } from "@/types";
import {
  Sparkles,
  TrendingDown,
  Lightbulb,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface AIInsightPanelProps {
  productId: string;
  country: string;
}

export default function AIInsightPanel({
  productId,
  country,
}: AIInsightPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ai-analyze?productId=${productId}&country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId, country]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">AI Analysis</h3>
            <p className="text-xs text-indigo-500">Analyzing prices...</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">
            Comparing merchants and calculating best value...
          </span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-indigo-100 p-2 rounded-xl">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900">AI Price Analysis</h3>
          <p className="text-xs text-indigo-500">
            Powered by smart price comparison
          </p>
        </div>
        {analysis.savingsPercentage > 0 && (
          <div className="ml-auto bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            Up to {analysis.savingsPercentage}% savings
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <div className="flex gap-3">
          <MessageSquare className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{analysis.summary}</p>
        </div>

        {/* Price Insight */}
        <div className="flex gap-3">
          <TrendingDown className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{analysis.priceInsight}</p>
        </div>

        {/* Recommendation */}
        <div className="flex gap-3 bg-white/60 rounded-xl p-4">
          <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Recommendation
            </p>
            <p className="text-sm text-gray-800 font-medium">
              {analysis.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
