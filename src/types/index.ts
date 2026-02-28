export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export interface Merchant {
  id: string;
  name: string;
  logo: string;
  countries: string[]; // country codes
  baseUrl: string;
  searchUrl: string; // search URL template with {query} placeholder
  rating: number;
}

export interface ProductListing {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  productName: string;
  price: number;
  originalPrice?: number;
  currency: string;
  currencySymbol: string;
  url: string;
  inStock: boolean;
  rating: number;
  deliveryDays: number;
  deliveryFee: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  description: string;
  listings: ProductListing[];
}

export interface SearchResult {
  query: string;
  country: Country;
  products: Product[];
  totalResults: number;
}

export interface AIAnalysis {
  bestValue: string;
  summary: string;
  priceInsight: string;
  recommendation: string;
  savingsPercentage: number;
}
