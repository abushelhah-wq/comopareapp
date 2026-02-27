import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/countries";
import { aiSearch } from "@/lib/ai-search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const country = searchParams.get("country") || "SA";

  if (!query.trim()) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const countryData = getCountryByCode(country);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
  }

  try {
    const products = await aiSearch(query, country);

    return NextResponse.json({
      query,
      country: countryData,
      products,
      totalResults: products.length,
    });
  } catch (error) {
    console.error("AI search error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
