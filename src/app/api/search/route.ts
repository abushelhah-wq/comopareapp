import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";
import { getCountryByCode } from "@/lib/countries";

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

  const products = searchProducts(query, country);

  return NextResponse.json({
    query,
    country: countryData,
    products,
    totalResults: products.length,
  });
}
