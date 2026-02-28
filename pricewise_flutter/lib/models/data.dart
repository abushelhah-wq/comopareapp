import 'models.dart';

const List<Country> countries = [
  Country(code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'ر.س', flag: '🇸🇦'),
  Country(code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'د.إ', flag: '🇦🇪'),
  Country(code: 'US', name: 'United States', currency: 'USD', currencySymbol: '\$', flag: '🇺🇸'),
  Country(code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', flag: '🇬🇧'),
  Country(code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'ج.م', flag: '🇪🇬'),
  Country(code: 'KW', name: 'Kuwait', currency: 'KWD', currencySymbol: 'د.ك', flag: '🇰🇼'),
  Country(code: 'BH', name: 'Bahrain', currency: 'BHD', currencySymbol: 'د.ب', flag: '🇧🇭'),
  Country(code: 'QA', name: 'Qatar', currency: 'QAR', currencySymbol: 'ر.ق', flag: '🇶🇦'),
];

const List<Merchant> merchants = [
  Merchant(id: 'noon', name: 'Noon', countries: ['SA', 'AE', 'EG'], baseUrl: 'https://www.noon.com', rating: 4.3),
  Merchant(id: 'amazon-sa', name: 'Amazon.sa', countries: ['SA'], baseUrl: 'https://www.amazon.sa', rating: 4.5),
  Merchant(id: 'amazon-ae', name: 'Amazon.ae', countries: ['AE'], baseUrl: 'https://www.amazon.ae', rating: 4.5),
  Merchant(id: 'jarir', name: 'Jarir Bookstore', countries: ['SA', 'AE', 'KW', 'QA', 'BH'], baseUrl: 'https://www.jarir.com', rating: 4.2),
  Merchant(id: 'extra', name: 'Extra', countries: ['SA', 'BH', 'KW'], baseUrl: 'https://www.extra.com', rating: 4.0),
  Merchant(id: 'lulu', name: 'LuLu Hypermarket', countries: ['SA', 'AE', 'KW', 'BH', 'QA', 'EG'], baseUrl: 'https://www.luluhypermarket.com', rating: 4.1),
  Merchant(id: 'sharaf-dg', name: 'Sharaf DG', countries: ['AE'], baseUrl: 'https://www.sharafdg.com', rating: 4.2),
  Merchant(id: 'amazon-us', name: 'Amazon.com', countries: ['US'], baseUrl: 'https://www.amazon.com', rating: 4.6),
  Merchant(id: 'walmart', name: 'Walmart', countries: ['US'], baseUrl: 'https://www.walmart.com', rating: 4.3),
  Merchant(id: 'bestbuy', name: 'Best Buy', countries: ['US'], baseUrl: 'https://www.bestbuy.com', rating: 4.4),
  Merchant(id: 'target', name: 'Target', countries: ['US'], baseUrl: 'https://www.target.com', rating: 4.2),
  Merchant(id: 'amazon-uk', name: 'Amazon.co.uk', countries: ['GB'], baseUrl: 'https://www.amazon.co.uk', rating: 4.5),
  Merchant(id: 'argos', name: 'Argos', countries: ['GB'], baseUrl: 'https://www.argos.co.uk', rating: 4.1),
  Merchant(id: 'currys', name: 'Currys', countries: ['GB'], baseUrl: 'https://www.currys.co.uk', rating: 4.0),
  Merchant(id: 'jumia', name: 'Jumia', countries: ['EG'], baseUrl: 'https://www.jumia.com.eg', rating: 3.9),
];

Country getCountryByCode(String code) {
  return countries.firstWhere((c) => c.code == code, orElse: () => countries.first);
}

List<Merchant> getMerchantsByCountry(String countryCode) {
  return merchants.where((m) => m.countries.contains(countryCode)).toList();
}

class CategoryItem {
  final String name;
  final String query;
  final int iconCodePoint;
  final int color;

  const CategoryItem({
    required this.name,
    required this.query,
    required this.iconCodePoint,
    required this.color,
  });
}

const List<CategoryItem> categories = [
  CategoryItem(name: 'Gaming', query: 'PS5 console', iconCodePoint: 0xe30f, color: 0xFF3B82F6),
  CategoryItem(name: 'Phones', query: 'iPhone 16 Pro', iconCodePoint: 0xe325, color: 0xFF8B5CF6),
  CategoryItem(name: 'Laptops', query: 'MacBook Pro', iconCodePoint: 0xe31e, color: 0xFF374151),
  CategoryItem(name: 'Audio', query: 'AirPods Pro', iconCodePoint: 0xe310, color: 0xFFF97316),
  CategoryItem(name: 'TVs', query: 'Samsung 65 inch TV', iconCodePoint: 0xe333, color: 0xFF14B8A6),
  CategoryItem(name: 'Tablets', query: 'iPad Pro', iconCodePoint: 0xe32f, color: 0xFF6366F1),
  CategoryItem(name: 'Watches', query: 'Apple Watch', iconCodePoint: 0xe334, color: 0xFFF43F5E),
  CategoryItem(name: 'Fashion', query: 'Nike Air Jordan', iconCodePoint: 0xe59c, color: 0xFF16A34A),
];

const List<String> popularSearches = [
  'PS5',
  'iPhone 16',
  'MacBook Pro',
  'AirPods Pro',
  'Samsung Galaxy S24',
  'Xbox Series X',
];
