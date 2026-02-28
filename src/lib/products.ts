import { Product, ProductListing } from "@/types";
import { getMerchantsByCountry, buildMerchantSearchUrl } from "./merchants";
import { getCountryByCode } from "./countries";

// Exchange rates relative to USD
const exchangeRates: Record<string, number> = {
  USD: 1,
  SAR: 3.75,
  AED: 3.67,
  GBP: 0.79,
  EGP: 30.9,
  KWD: 0.31,
  BHD: 0.38,
  QAR: 3.64,
};

// Base product catalog with USD prices
interface BaseProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  description: string;
  basePriceUSD: number;
  originalPriceUSD?: number;
  keywords: string[];
}

const productCatalog: BaseProduct[] = [
  // Gaming Consoles
  {
    id: "ps5-standard",
    name: "PlayStation 5 Console (Disc Edition)",
    category: "Gaming",
    brand: "Sony",
    image: "/products/ps5.jpg",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    basePriceUSD: 499,
    keywords: ["ps5", "playstation", "playstation 5", "sony", "gaming", "console"],
  },
  {
    id: "ps5-digital",
    name: "PlayStation 5 Digital Edition",
    category: "Gaming",
    brand: "Sony",
    image: "/products/ps5-digital.jpg",
    description:
      "The PS5 Digital Edition is an all-digital version of the PS5 console with no disc drive.",
    basePriceUSD: 399,
    originalPriceUSD: 449,
    keywords: ["ps5", "playstation", "playstation 5", "sony", "gaming", "console", "digital"],
  },
  {
    id: "xbox-series-x",
    name: "Xbox Series X",
    category: "Gaming",
    brand: "Microsoft",
    image: "/products/xbox-x.jpg",
    description:
      "The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power.",
    basePriceUSD: 499,
    keywords: ["xbox", "series x", "microsoft", "gaming", "console"],
  },
  {
    id: "xbox-series-s",
    name: "Xbox Series S",
    category: "Gaming",
    brand: "Microsoft",
    image: "/products/xbox-s.jpg",
    description:
      "Go all-digital with the Xbox Series S and enjoy next-gen performance in the smallest Xbox ever.",
    basePriceUSD: 299,
    keywords: ["xbox", "series s", "microsoft", "gaming", "console"],
  },
  {
    id: "nintendo-switch-oled",
    name: "Nintendo Switch OLED Model",
    category: "Gaming",
    brand: "Nintendo",
    image: "/products/switch-oled.jpg",
    description:
      "Featuring a vibrant 7-inch OLED screen, a wide adjustable stand, and enhanced audio.",
    basePriceUSD: 349,
    keywords: ["nintendo", "switch", "oled", "gaming", "console", "portable"],
  },
  // Phones
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max 256GB",
    category: "Phones",
    brand: "Apple",
    image: "/products/iphone16pm.jpg",
    description:
      "iPhone 16 Pro Max. Built for Apple Intelligence. Featuring a camera control, 4K 120fps Dolby Vision, and the A18 Pro chip.",
    basePriceUSD: 1199,
    keywords: ["iphone", "iphone 16", "apple", "phone", "smartphone", "pro max"],
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro 128GB",
    category: "Phones",
    brand: "Apple",
    image: "/products/iphone16p.jpg",
    description: "iPhone 16 Pro. Built for Apple Intelligence with the A18 Pro chip.",
    basePriceUSD: 999,
    keywords: ["iphone", "iphone 16", "apple", "phone", "smartphone", "pro"],
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    category: "Phones",
    brand: "Samsung",
    image: "/products/s24ultra.jpg",
    description:
      "Galaxy AI is here. Search like never before, Icons, Chat Assist, Note Assist with the most powerful Galaxy Ultra.",
    basePriceUSD: 1299,
    keywords: ["samsung", "galaxy", "s24", "ultra", "phone", "smartphone", "android"],
  },
  {
    id: "samsung-s24",
    name: "Samsung Galaxy S24 128GB",
    category: "Phones",
    brand: "Samsung",
    image: "/products/s24.jpg",
    description: "Galaxy AI is here. The new Galaxy S24 with ProVisual Engine.",
    basePriceUSD: 799,
    keywords: ["samsung", "galaxy", "s24", "phone", "smartphone", "android"],
  },
  // Laptops
  {
    id: "macbook-pro-14-m3",
    name: 'MacBook Pro 14" M3 Pro',
    category: "Laptops",
    brand: "Apple",
    image: "/products/macbookpro14.jpg",
    description:
      "Supercharged by M3 Pro. Up to 18 hours of battery life. A stunning Liquid Retina XDR display.",
    basePriceUSD: 1999,
    keywords: ["macbook", "pro", "apple", "laptop", "m3"],
  },
  {
    id: "macbook-air-m3",
    name: 'MacBook Air 15" M3',
    category: "Laptops",
    brand: "Apple",
    image: "/products/macbookair15.jpg",
    description:
      "Strikingly thin and fast with the M3 chip. Up to 18 hours of battery life.",
    basePriceUSD: 1299,
    keywords: ["macbook", "air", "apple", "laptop", "m3"],
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15 (2024)",
    category: "Laptops",
    brand: "Dell",
    image: "/products/dellxps15.jpg",
    description: "InfinityEdge display, Intel Core i7, 16GB RAM, 512GB SSD.",
    basePriceUSD: 1499,
    keywords: ["dell", "xps", "laptop", "windows"],
  },
  // Audio
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2nd Generation",
    category: "Audio",
    brand: "Apple",
    image: "/products/airpodspro2.jpg",
    description:
      "Rebuilt from the sound up. Featuring Adaptive Audio, USB-C charging, and up to 2x more Active Noise Cancellation.",
    basePriceUSD: 249,
    keywords: ["airpods", "pro", "apple", "earbuds", "headphones", "wireless", "audio"],
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Headphones",
    category: "Audio",
    brand: "Sony",
    image: "/products/sonyxm5.jpg",
    description:
      "Industry-leading noise cancellation optimized with Auto NC Optimizer and 8 microphones.",
    basePriceUSD: 349,
    keywords: ["sony", "headphones", "noise cancellation", "wireless", "audio", "xm5"],
  },
  // TVs
  {
    id: "samsung-qled-65",
    name: 'Samsung 65" QLED 4K Smart TV',
    category: "TVs",
    brand: "Samsung",
    image: "/products/samsungtv65.jpg",
    description:
      "Quantum Dot technology, 100% Color Volume, Smart TV with Tizen OS.",
    basePriceUSD: 999,
    keywords: ["samsung", "tv", "qled", "4k", "smart tv", "65 inch", "television"],
  },
  {
    id: "lg-oled-c3-55",
    name: 'LG 55" OLED C3 4K Smart TV',
    category: "TVs",
    brand: "LG",
    image: "/products/lgoled55.jpg",
    description:
      "Self-lit OLED pixels, α9 Gen6 AI Processor 4K, Dolby Vision & Dolby Atmos.",
    basePriceUSD: 1299,
    keywords: ["lg", "tv", "oled", "4k", "smart tv", "55 inch", "television", "c3"],
  },
  // Tablets
  {
    id: "ipad-pro-m4",
    name: "iPad Pro 11-inch M4",
    category: "Tablets",
    brand: "Apple",
    image: "/products/ipadprom4.jpg",
    description:
      "Thinnest Apple product ever. M4 chip, Ultra Retina XDR display, Apple Pencil Pro.",
    basePriceUSD: 999,
    keywords: ["ipad", "pro", "apple", "tablet", "m4"],
  },
  {
    id: "samsung-tab-s9",
    name: "Samsung Galaxy Tab S9 Ultra",
    category: "Tablets",
    brand: "Samsung",
    image: "/products/tabs9.jpg",
    description: "14.6-inch Dynamic AMOLED 2X, Snapdragon 8 Gen 2, S Pen included.",
    basePriceUSD: 1199,
    keywords: ["samsung", "galaxy", "tab", "tablet", "android", "s9"],
  },
  // Wearables
  {
    id: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "Wearables",
    brand: "Apple",
    image: "/products/watchultra2.jpg",
    description:
      "The most rugged and capable Apple Watch with precision dual-frequency GPS and up to 36 hours of battery.",
    basePriceUSD: 799,
    keywords: ["apple", "watch", "ultra", "smartwatch", "wearable"],
  },
  {
    id: "apple-watch-series-9",
    name: "Apple Watch Series 9",
    category: "Wearables",
    brand: "Apple",
    image: "/products/watchs9.jpg",
    description: "Smarter. Brighter. Mightier. Featuring the new S9 chip and Double Tap gesture.",
    basePriceUSD: 399,
    keywords: ["apple", "watch", "series 9", "smartwatch", "wearable"],
  },
];

// Generate a deterministic but varied price for a merchant
function generateMerchantPrice(
  basePriceUSD: number,
  merchantId: string,
  countryCode: string
): { price: number; inStock: boolean; deliveryDays: number; deliveryFee: number } {
  // Create a simple hash from merchant+country for consistent pricing
  let hash = 0;
  const str = merchantId + countryCode;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  // Price variation: -8% to +15% from base
  const variation = ((Math.abs(hash) % 23) - 8) / 100;
  const rate = exchangeRates[getCountryByCode(countryCode)?.currency || "USD"] || 1;
  const localPrice = basePriceUSD * rate * (1 + variation);

  // Round nicely
  const price = Math.round(localPrice * 100) / 100;

  // Stock availability (90% chance in stock)
  const inStock = Math.abs(hash) % 10 !== 0;

  // Delivery days: 1-7
  const deliveryDays = (Math.abs(hash) % 7) + 1;

  // Delivery fee
  const deliveryFee =
    price > 200 * rate ? 0 : Math.round(15 * rate * 100) / 100;

  return { price, inStock, deliveryDays, deliveryFee };
}

export function searchProducts(query: string, countryCode: string): Product[] {
  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/);
  const country = getCountryByCode(countryCode);
  if (!country) return [];

  const countryMerchants = getMerchantsByCountry(countryCode);
  if (countryMerchants.length === 0) return [];

  // Score and filter products
  const scored = productCatalog
    .map((product) => {
      let score = 0;
      const nameL = product.name.toLowerCase();
      const descL = product.description.toLowerCase();

      // Exact match in name
      if (nameL.includes(lowerQuery)) score += 10;

      // Each word match in name/keywords/description
      for (const word of queryWords) {
        if (nameL.includes(word)) score += 5;
        if (product.keywords.some((k) => k.includes(word))) score += 3;
        if (product.brand.toLowerCase().includes(word)) score += 4;
        if (product.category.toLowerCase().includes(word)) score += 2;
        if (descL.includes(word)) score += 1;
      }

      return { product, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(({ product }) => {
    const listings: ProductListing[] = countryMerchants.map((merchant) => {
      const { price, inStock, deliveryDays, deliveryFee } = generateMerchantPrice(
        product.basePriceUSD,
        merchant.id,
        countryCode
      );

      return {
        id: `${product.id}-${merchant.id}`,
        merchantId: merchant.id,
        merchantName: merchant.name,
        merchantLogo: merchant.logo,
        productName: product.name,
        price,
        originalPrice: product.originalPriceUSD
          ? Math.round(
              product.originalPriceUSD *
                exchangeRates[country.currency] *
                1.05 *
                100
            ) / 100
          : undefined,
        currency: country.currency,
        currencySymbol: country.currencySymbol,
        url: buildMerchantSearchUrl(merchant, product.name),
        inStock,
        rating: merchant.rating + ((price % 10) - 5) / 20,
        deliveryDays,
        deliveryFee,
        image: product.image,
      };
    });

    // Sort by price
    listings.sort((a, b) => a.price - b.price);

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      image: product.image,
      description: product.description,
      listings,
    };
  });
}

export function getProductById(
  productId: string,
  countryCode: string
): Product | undefined {
  const country = getCountryByCode(countryCode);
  if (!country) return undefined;

  const base = productCatalog.find((p) => p.id === productId);
  if (!base) return undefined;

  const countryMerchants = getMerchantsByCountry(countryCode);

  const listings: ProductListing[] = countryMerchants.map((merchant) => {
    const { price, inStock, deliveryDays, deliveryFee } = generateMerchantPrice(
      base.basePriceUSD,
      merchant.id,
      countryCode
    );

    return {
      id: `${base.id}-${merchant.id}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantLogo: merchant.logo,
      productName: base.name,
      price,
      originalPrice: base.originalPriceUSD
        ? Math.round(
            base.originalPriceUSD *
              exchangeRates[country.currency] *
              1.05 *
              100
          ) / 100
        : undefined,
      currency: country.currency,
      currencySymbol: country.currencySymbol,
      url: buildMerchantSearchUrl(merchant, base.name),
      inStock,
      rating: merchant.rating + ((price % 10) - 5) / 20,
      deliveryDays,
      deliveryFee,
      image: base.image,
    };
  });

  listings.sort((a, b) => a.price - b.price);

  return {
    id: base.id,
    name: base.name,
    category: base.category,
    brand: base.brand,
    image: base.image,
    description: base.description,
    listings,
  };
}

export function getPopularProducts(countryCode: string): Product[] {
  // Return a curated selection of popular products
  const popularIds = [
    "ps5-standard",
    "iphone-16-pro-max",
    "macbook-pro-14-m3",
    "airpods-pro-2",
    "samsung-s24-ultra",
    "apple-watch-ultra-2",
  ];

  return popularIds
    .map((id) => getProductById(id, countryCode))
    .filter((p): p is Product => p !== undefined);
}
