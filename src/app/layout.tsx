import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PriceWise - Smart Ecommerce Price Comparison",
  description:
    "Compare prices across multiple merchants in your country. Find the best deals with AI-powered price analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
