import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/countries";
import { aiGetProduct } from "@/lib/ai-search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || "";
  const country = searchParams.get("country") || "SA";

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const countryData = getCountryByCode(country);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
  }

  try {
    // Convert slug back to a readable name for AI search
    const productName = id.replace(/-/g, " ");
    const product = await aiGetProduct(productName, country);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure the product ID matches what was requested
    product.id = id;

    return NextResponse.json({ product, country: countryData });
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product. Please try again." },
      { status: 500 }
    );
  }
}
