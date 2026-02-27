import { Product, AIAnalysis } from "@/types";

export function analyzeProduct(product: Product): AIAnalysis {
  const listings = product.listings.filter((l) => l.inStock);

  if (listings.length === 0) {
    return {
      bestValue: "",
      summary: "This product is currently out of stock at all merchants.",
      priceInsight: "No pricing data available.",
      recommendation: "Check back later for availability.",
      savingsPercentage: 0,
    };
  }

  const cheapest = listings[0];
  const mostExpensive = listings[listings.length - 1];
  const avgPrice =
    listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
  const priceDiff = mostExpensive.price - cheapest.price;
  const savingsPercentage = Math.round(
    (priceDiff / mostExpensive.price) * 100
  );

  // Find best value (considering price, delivery, and rating)
  const valueScores = listings.map((l) => {
    const priceScore = 1 - (l.price - cheapest.price) / (mostExpensive.price - cheapest.price || 1);
    const deliveryScore = 1 - l.deliveryDays / 7;
    const freeDeliveryScore = l.deliveryFee === 0 ? 1 : 0;
    const ratingScore = l.rating / 5;

    return {
      listing: l,
      score: priceScore * 0.4 + deliveryScore * 0.25 + freeDeliveryScore * 0.15 + ratingScore * 0.2,
    };
  });

  valueScores.sort((a, b) => b.score - a.score);
  const bestValue = valueScores[0].listing;

  const cheapestName = cheapest.merchantName;
  const bestValueName = bestValue.merchantName;

  // Generate AI-like insights
  const priceInsights: string[] = [];

  if (savingsPercentage > 15) {
    priceInsights.push(
      `There's a significant price gap of ${savingsPercentage}% between the cheapest and most expensive options.`
    );
  } else if (savingsPercentage > 5) {
    priceInsights.push(
      `Prices vary moderately across merchants with a ${savingsPercentage}% spread.`
    );
  } else {
    priceInsights.push(
      `Prices are fairly competitive across merchants with only a ${savingsPercentage}% difference.`
    );
  }

  if (cheapest.deliveryFee === 0) {
    priceInsights.push(
      `${cheapestName} also offers free delivery, making it even better value.`
    );
  }

  const freeDeliveryOptions = listings.filter((l) => l.deliveryFee === 0);
  if (freeDeliveryOptions.length > 1) {
    priceInsights.push(
      `${freeDeliveryOptions.length} merchants offer free delivery for this item.`
    );
  }

  // Summary
  const summary = `Analyzed ${listings.length} merchant${listings.length > 1 ? "s" : ""} for ${product.name}. ` +
    `Prices range from ${cheapest.currencySymbol} ${cheapest.price.toLocaleString()} to ${mostExpensive.currencySymbol} ${mostExpensive.price.toLocaleString()}, ` +
    `with an average of ${cheapest.currencySymbol} ${Math.round(avgPrice).toLocaleString()}.`;

  // Recommendation
  let recommendation: string;
  if (bestValue.merchantId === cheapest.merchantId) {
    recommendation =
      `${cheapestName} is the clear winner here — it offers the lowest price at ${cheapest.currencySymbol} ${cheapest.price.toLocaleString()}` +
      (cheapest.deliveryFee === 0
        ? " with free delivery."
        : ` with delivery in ${cheapest.deliveryDays} day${cheapest.deliveryDays > 1 ? "s" : ""}.`);
  } else {
    recommendation =
      `While ${cheapestName} has the lowest price at ${cheapest.currencySymbol} ${cheapest.price.toLocaleString()}, ` +
      `${bestValueName} offers better overall value when considering delivery speed (${bestValue.deliveryDays} day${bestValue.deliveryDays > 1 ? "s" : ""})` +
      (bestValue.deliveryFee === 0 ? " and free shipping." : ".");
  }

  return {
    bestValue: bestValue.merchantId,
    summary,
    priceInsight: priceInsights.join(" "),
    recommendation,
    savingsPercentage,
  };
}
