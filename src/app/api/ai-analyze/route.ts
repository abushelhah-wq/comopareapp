import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { analyzeProduct } from "@/lib/ai-analyzer";

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

  const product = getProductById(productId, country);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Simulate AI processing delay for realism
  await new Promise((resolve) => setTimeout(resolve, 500));

  const analysis = analyzeProduct(product);

  return NextResponse.json(analysis);
}
