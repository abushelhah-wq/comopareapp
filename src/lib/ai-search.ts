import Anthropic from "@anthropic-ai/sdk";
import { Product, AIAnalysis } from "@/types";
import { getMerchantsByCountry, buildMerchantSearchUrl } from "./merchants";
import { getCountryByCode } from "./countries";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AIProductResult {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  imageUrl?: string;
  merchants: {
    merchantId: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    deliveryDays: number;
    deliveryFee: number;
    rating: number;
  }[];
}

export async function aiSearch(
  query: string,
  countryCode: string
): Promise<Product[]> {
  const country = getCountryByCode(countryCode);
  if (!country) return [];

  const countryMerchants = getMerchantsByCountry(countryCode);
  if (countryMerchants.length === 0) return [];

  const merchantList = countryMerchants
    .map((m) => `- ${m.id}: "${m.name}" (rating: ${m.rating})`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a price comparison engine. A user in ${country.name} is searching for: "${query}"

Available merchants in ${country.name}:
${merchantList}

Currency: ${country.currency} (${country.currencySymbol})

Return a JSON array of products that match this search query. For each product, provide realistic market prices in ${country.currency} from the available merchants. Prices should reflect real-world pricing for ${country.name} market as accurately as possible.

IMPORTANT RULES:
- Return 1-5 products that best match the search query
- Each product must have prices from ALL available merchants listed above
- Prices should vary between merchants (realistic price differences of 2-15%)
- Some items may have original/sale prices
- Most items should be in stock (set a few to out of stock for realism)
- Delivery days: 1-7 days, delivery fee: 0 for expensive items, small fee for cheaper ones
- Product IDs should be kebab-case slugs (e.g., "iphone-16-pro-max-256gb")
- Be realistic with pricing for the ${country.name} market
- For imageUrl, provide a REAL working product image URL from the manufacturer's official website, a major CDN, or a well-known public product image source. The image must be directly accessible (not behind authentication). If unsure, use an empty string.

Respond ONLY with a valid JSON array, no other text. Use this exact structure:
[
  {
    "id": "product-slug-id",
    "name": "Full Product Name",
    "category": "Category",
    "brand": "Brand",
    "imageUrl": "https://example.com/product-image.jpg",
    "description": "Short product description",
    "merchants": [
      {
        "merchantId": "merchant-id-from-list",
        "price": 1999.99,
        "originalPrice": 2199.99,
        "inStock": true,
        "deliveryDays": 3,
        "deliveryFee": 0,
        "rating": 4.5
      }
    ]
  }
]`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from the response
  let parsed: AIProductResult[];
  try {
    // Try to find JSON array in the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }

  // Convert AI results to Product format
  return parsed.map((item) => {
    const productImage = item.imageUrl || "";

    const listings = item.merchants
      .map((m) => {
        const merchant = countryMerchants.find((cm) => cm.id === m.merchantId);
        if (!merchant) return null;

        return {
          id: `${item.id}-${m.merchantId}`,
          merchantId: m.merchantId,
          merchantName: merchant.name,
          merchantLogo: merchant.logo,
          productName: item.name,
          price: m.price,
          originalPrice: m.originalPrice,
          currency: country.currency,
          currencySymbol: country.currencySymbol,
          url: buildMerchantSearchUrl(merchant, item.name),
          inStock: m.inStock,
          rating: m.rating,
          deliveryDays: m.deliveryDays,
          deliveryFee: m.deliveryFee,
          image: productImage,
        };
      })
      .filter((l) => l !== null);

    // Sort listings by price
    listings.sort((a, b) => a.price - b.price);

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      brand: item.brand,
      image: productImage,
      description: item.description,
      listings,
    };
  });
}

export async function aiGetProduct(
  productName: string,
  countryCode: string
): Promise<Product | null> {
  const results = await aiSearch(productName, countryCode);
  return results.length > 0 ? results[0] : null;
}

export async function aiAnalyzeProduct(product: Product): Promise<AIAnalysis> {
  const country = getCountryByCode(
    product.listings[0]?.currency === "SAR"
      ? "SA"
      : product.listings[0]?.currency === "AED"
      ? "AE"
      : product.listings[0]?.currency === "GBP"
      ? "GB"
      : product.listings[0]?.currency === "EGP"
      ? "EG"
      : product.listings[0]?.currency === "KWD"
      ? "KW"
      : product.listings[0]?.currency === "BHD"
      ? "BH"
      : product.listings[0]?.currency === "QAR"
      ? "QA"
      : "US"
  );

  const inStockListings = product.listings.filter((l) => l.inStock);
  if (inStockListings.length === 0) {
    return {
      bestValue: "",
      summary: "This product is currently out of stock at all merchants.",
      priceInsight: "No pricing data available.",
      recommendation: "Check back later for availability.",
      savingsPercentage: 0,
    };
  }

  const listingsSummary = inStockListings
    .map(
      (l) =>
        `${l.merchantName}: ${l.currencySymbol} ${l.price} (delivery: ${l.deliveryDays} days, fee: ${l.deliveryFee}, rating: ${l.rating})`
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a smart shopping advisor. Analyze these merchant prices for "${product.name}" in ${country?.name || "this region"} and provide insights.

Merchant prices:
${listingsSummary}

Respond ONLY with valid JSON using this exact structure:
{
  "bestValue": "merchant-id-of-best-overall-value",
  "summary": "A 1-2 sentence summary of the price comparison",
  "priceInsight": "A specific insight about pricing trends, gaps, or notable findings",
  "recommendation": "A clear, actionable recommendation for the buyer",
  "savingsPercentage": 12
}

The bestValue should be the merchantId that offers the best combination of price, delivery speed, and reliability. The savingsPercentage is the % difference between cheapest and most expensive.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]);
  } catch {
    // Fallback to computed analysis
    const cheapest = inStockListings[0];
    const mostExpensive = inStockListings[inStockListings.length - 1];
    const savings = Math.round(
      ((mostExpensive.price - cheapest.price) / mostExpensive.price) * 100
    );

    return {
      bestValue: cheapest.merchantId,
      summary: `Compared ${inStockListings.length} merchants for ${product.name}. Prices range from ${cheapest.currencySymbol} ${cheapest.price.toLocaleString()} to ${mostExpensive.currencySymbol} ${mostExpensive.price.toLocaleString()}.`,
      priceInsight: `There is a ${savings}% price difference between the cheapest and most expensive options.`,
      recommendation: `${cheapest.merchantName} offers the lowest price at ${cheapest.currencySymbol} ${cheapest.price.toLocaleString()}.`,
      savingsPercentage: savings,
    };
  }
}
