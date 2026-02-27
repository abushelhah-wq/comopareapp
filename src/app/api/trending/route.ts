import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCountryByCode } from "@/lib/countries";
import { getMerchantsByCountry } from "@/lib/merchants";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface TrendingItem {
  rank: number;
  name: string;
  category: string;
  searchQuery: string;
  reason: string;
  priceRange: string;
  emoji: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country") || "SA";

  const countryData = getCountryByCode(country);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
  }

  const countryMerchants = getMerchantsByCountry(country);
  const merchantNames = countryMerchants.map((m) => m.name).join(", ");

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a market trends analyst. What are the top 8 most searched/trending products that people in ${countryData.name} are currently looking to buy online in 2025?

Consider:
- Products popular in ${countryData.name} specifically (cultural preferences, local demand)
- Seasonal trends and new releases
- Products commonly compared on price comparison sites
- Available at merchants like: ${merchantNames}

Return ONLY a valid JSON array with this structure:
[
  {
    "rank": 1,
    "name": "Product Name",
    "category": "Category",
    "searchQuery": "exact search query to find this product",
    "reason": "Short reason why it's trending (10-15 words max)",
    "priceRange": "approximate price range in ${countryData.currency}",
    "emoji": "single relevant emoji"
  }
]

Make it diverse — mix electronics, lifestyle, home, fashion etc. Be specific with product names (not just "laptop" but "MacBook Air M3" or "Samsung Galaxy S24").`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse trends" }, { status: 500 });
    }

    const trends: TrendingItem[] = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      country: countryData,
      trends,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Trending fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending items" },
      { status: 500 }
    );
  }
}
