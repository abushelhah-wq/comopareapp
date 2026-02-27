import { Country } from "@/types";

export const countries: Country[] = [
  {
    code: "SA",
    name: "Saudi Arabia",
    currency: "SAR",
    currencySymbol: "ر.س",
    flag: "🇸🇦",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    currency: "AED",
    currencySymbol: "د.إ",
    flag: "🇦🇪",
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    flag: "🇺🇸",
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    flag: "🇬🇧",
  },
  {
    code: "EG",
    name: "Egypt",
    currency: "EGP",
    currencySymbol: "ج.م",
    flag: "🇪🇬",
  },
  {
    code: "KW",
    name: "Kuwait",
    currency: "KWD",
    currencySymbol: "د.ك",
    flag: "🇰🇼",
  },
  {
    code: "BH",
    name: "Bahrain",
    currency: "BHD",
    currencySymbol: "د.ب",
    flag: "🇧🇭",
  },
  {
    code: "QA",
    name: "Qatar",
    currency: "QAR",
    currencySymbol: "ر.ق",
    flag: "🇶🇦",
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
