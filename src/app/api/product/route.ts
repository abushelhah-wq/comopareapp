import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getCountryByCode } from "@/lib/countries";

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

  const product = getProductById(id, country);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product, country: countryData });
}
