import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/countries";
import { aiGetProduct, aiAnalyzeProduct } from "@/lib/ai-search";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId") || "";
  const country = searchParams.get("country") || "SA";

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const countryData = getCountryByCode(country);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  try {
    const productName = productId.replace(/-/g, " ");
    const product = await aiGetProduct(productName, country);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const analysis = await aiAnalyzeProduct(product);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      {
        bestValue: "",
        summary: "Unable to generate AI analysis at this time.",
        priceInsight: "Please try again later.",
        recommendation: "Compare the prices manually using the table above.",
        savingsPercentage: 0,
      },
      { status: 200 }
    );
  }
}
