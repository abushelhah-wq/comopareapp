import { Merchant } from "@/types";

export const merchants: Merchant[] = [
  // Saudi Arabia & Gulf merchants
  {
    id: "noon",
    name: "Noon",
    logo: "/merchants/noon.svg",
    countries: ["SA", "AE", "EG"],
    baseUrl: "https://www.noon.com",
    rating: 4.3,
  },
  {
    id: "amazon-sa",
    name: "Amazon.sa",
    logo: "/merchants/amazon.svg",
    countries: ["SA"],
    baseUrl: "https://www.amazon.sa",
    rating: 4.5,
  },
  {
    id: "amazon-ae",
    name: "Amazon.ae",
    logo: "/merchants/amazon.svg",
    countries: ["AE"],
    baseUrl: "https://www.amazon.ae",
    rating: 4.5,
  },
  {
    id: "jarir",
    name: "Jarir Bookstore",
    logo: "/merchants/jarir.svg",
    countries: ["SA", "AE", "KW", "QA", "BH"],
    baseUrl: "https://www.jarir.com",
    rating: 4.2,
  },
  {
    id: "extra",
    name: "Extra",
    logo: "/merchants/extra.svg",
    countries: ["SA", "BH", "KW"],
    baseUrl: "https://www.extra.com",
    rating: 4.0,
  },
  {
    id: "lulu",
    name: "LuLu Hypermarket",
    logo: "/merchants/lulu.svg",
    countries: ["SA", "AE", "KW", "BH", "QA", "EG"],
    baseUrl: "https://www.luluhypermarket.com",
    rating: 4.1,
  },
  // UAE specific
  {
    id: "sharaf-dg",
    name: "Sharaf DG",
    logo: "/merchants/sharafdg.svg",
    countries: ["AE"],
    baseUrl: "https://www.sharafdg.com",
    rating: 4.2,
  },
  // US merchants
  {
    id: "amazon-us",
    name: "Amazon.com",
    logo: "/merchants/amazon.svg",
    countries: ["US"],
    baseUrl: "https://www.amazon.com",
    rating: 4.6,
  },
  {
    id: "walmart",
    name: "Walmart",
    logo: "/merchants/walmart.svg",
    countries: ["US"],
    baseUrl: "https://www.walmart.com",
    rating: 4.3,
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    logo: "/merchants/bestbuy.svg",
    countries: ["US"],
    baseUrl: "https://www.bestbuy.com",
    rating: 4.4,
  },
  {
    id: "target",
    name: "Target",
    logo: "/merchants/target.svg",
    countries: ["US"],
    baseUrl: "https://www.target.com",
    rating: 4.2,
  },
  // UK merchants
  {
    id: "amazon-uk",
    name: "Amazon.co.uk",
    logo: "/merchants/amazon.svg",
    countries: ["GB"],
    baseUrl: "https://www.amazon.co.uk",
    rating: 4.5,
  },
  {
    id: "argos",
    name: "Argos",
    logo: "/merchants/argos.svg",
    countries: ["GB"],
    baseUrl: "https://www.argos.co.uk",
    rating: 4.1,
  },
  {
    id: "currys",
    name: "Currys",
    logo: "/merchants/currys.svg",
    countries: ["GB"],
    baseUrl: "https://www.currys.co.uk",
    rating: 4.0,
  },
  // Egypt
  {
    id: "jumia",
    name: "Jumia",
    logo: "/merchants/jumia.svg",
    countries: ["EG"],
    baseUrl: "https://www.jumia.com.eg",
    rating: 3.9,
  },
];

export function getMerchantsByCountry(countryCode: string): Merchant[] {
  return merchants.filter((m) => m.countries.includes(countryCode));
}

export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find((m) => m.id === id);
}
