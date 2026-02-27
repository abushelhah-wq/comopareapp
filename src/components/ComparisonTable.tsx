"use client";

import { ProductListing } from "@/types";
import {
  Check,
  X,
  Truck,
  Star,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";

interface ComparisonTableProps {
  listings: ProductListing[];
  bestValueMerchantId?: string;
}

export default function ComparisonTable({
  listings,
  bestValueMerchantId,
}: ComparisonTableProps) {
  const cheapestPrice = Math.min(...listings.filter(l => l.inStock).map((l) => l.price));

  return (
    <div className="space-y-3">
      {listings.map((listing, index) => {
        const isCheapest = listing.price === cheapestPrice && listing.inStock;
        const isBestValue = listing.merchantId === bestValueMerchantId;
        const totalCost = listing.price + listing.deliveryFee;

        return (
          <div
            key={listing.id}
            className={`relative rounded-xl border-2 overflow-hidden transition-all ${
              isCheapest
                ? "border-green-400 bg-green-50/50 shadow-md"
                : isBestValue
                ? "border-indigo-400 bg-indigo-50/50 shadow-md"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
            } ${!listing.inStock ? "opacity-60" : ""}`}
          >
            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-2">
              {isCheapest && listing.inStock && (
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  <Award className="h-3 w-3" /> Lowest Price
                </span>
              )}
              {isBestValue && !isCheapest && listing.inStock && (
                <span className="inline-flex items-center gap-1 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" /> Best Value
                </span>
              )}
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Rank & Merchant */}
                <div className="flex items-center gap-3 sm:w-56">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 && listing.inStock
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {listing.merchantName}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{listing.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:flex-1">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl font-bold ${
                        isCheapest && listing.inStock
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {listing.currencySymbol}{" "}
                      {listing.price.toLocaleString()}
                    </span>
                    {listing.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {listing.currencySymbol}{" "}
                        {listing.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {listing.inStock && listing.deliveryFee > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      + {listing.currencySymbol}{" "}
                      {listing.deliveryFee.toLocaleString()} delivery = Total:{" "}
                      {listing.currencySymbol} {totalCost.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Delivery & Stock */}
                <div className="flex items-center gap-4 sm:w-48">
                  <div className="flex items-center gap-1.5">
                    {listing.inStock ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          In Stock
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-400">
                          Out of Stock
                        </span>
                      </>
                    )}
                  </div>

                  {listing.inStock && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Truck className="h-4 w-4" />
                      <span>
                        {listing.deliveryDays} day
                        {listing.deliveryDays > 1 ? "s" : ""}
                      </span>
                      {listing.deliveryFee === 0 && (
                        <span className="text-green-500 font-medium text-xs">
                          FREE
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="sm:w-32">
                  {listing.inStock ? (
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 w-full justify-center bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Visit Store
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center justify-center w-full text-gray-400 text-sm px-4 py-2.5 rounded-xl bg-gray-100">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
