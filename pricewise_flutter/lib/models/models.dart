class Country {
  final String code;
  final String name;
  final String currency;
  final String currencySymbol;
  final String flag;

  const Country({
    required this.code,
    required this.name,
    required this.currency,
    required this.currencySymbol,
    required this.flag,
  });

  factory Country.fromJson(Map<String, dynamic> json) => Country(
        code: json['code'] ?? '',
        name: json['name'] ?? '',
        currency: json['currency'] ?? '',
        currencySymbol: json['currencySymbol'] ?? '',
        flag: json['flag'] ?? '',
      );
}

class Merchant {
  final String id;
  final String name;
  final List<String> countries;
  final String baseUrl;
  final String searchUrl; // search URL template with {query} placeholder
  final double rating;

  const Merchant({
    required this.id,
    required this.name,
    required this.countries,
    required this.baseUrl,
    required this.searchUrl,
    required this.rating,
  });

  String buildSearchUrl(String productName) {
    return searchUrl.replaceAll('{query}', Uri.encodeComponent(productName));
  }
}

class ProductListing {
  final String id;
  final String merchantId;
  final String merchantName;
  final String productName;
  final double price;
  final double? originalPrice;
  final String currency;
  final String currencySymbol;
  final String url;
  final bool inStock;
  final double rating;
  final int deliveryDays;
  final double deliveryFee;

  const ProductListing({
    required this.id,
    required this.merchantId,
    required this.merchantName,
    required this.productName,
    required this.price,
    this.originalPrice,
    required this.currency,
    required this.currencySymbol,
    required this.url,
    required this.inStock,
    required this.rating,
    required this.deliveryDays,
    required this.deliveryFee,
  });

  factory ProductListing.fromJson(Map<String, dynamic> json) => ProductListing(
        id: json['id'] ?? '',
        merchantId: json['merchantId'] ?? '',
        merchantName: json['merchantName'] ?? '',
        productName: json['productName'] ?? '',
        price: (json['price'] ?? 0).toDouble(),
        originalPrice: json['originalPrice']?.toDouble(),
        currency: json['currency'] ?? '',
        currencySymbol: json['currencySymbol'] ?? '',
        url: json['url'] ?? '',
        inStock: json['inStock'] ?? true,
        rating: (json['rating'] ?? 0).toDouble(),
        deliveryDays: json['deliveryDays'] ?? 1,
        deliveryFee: (json['deliveryFee'] ?? 0).toDouble(),
      );
}

class Product {
  final String id;
  final String name;
  final String category;
  final String brand;
  final String description;
  final String image;
  final List<ProductListing> listings;

  const Product({
    required this.id,
    required this.name,
    required this.category,
    required this.brand,
    required this.description,
    this.image = '',
    required this.listings,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        category: json['category'] ?? '',
        brand: json['brand'] ?? '',
        description: json['description'] ?? '',
        image: json['image'] ?? '',
        listings: (json['listings'] as List<dynamic>?)
                ?.map((l) => ProductListing.fromJson(l))
                .toList() ??
            [],
      );

  bool get hasImage => image.isNotEmpty && image.startsWith('http');

  double? get lowestPrice {
    final inStockListings = listings.where((l) => l.inStock).toList();
    if (inStockListings.isEmpty) return null;
    return inStockListings
        .map((l) => l.price)
        .reduce((a, b) => a < b ? a : b);
  }

  double? get highestPrice {
    final inStockListings = listings.where((l) => l.inStock).toList();
    if (inStockListings.isEmpty) return null;
    return inStockListings
        .map((l) => l.price)
        .reduce((a, b) => a > b ? a : b);
  }

  int get savingsPercent {
    final low = lowestPrice;
    final high = highestPrice;
    if (low == null || high == null || high == 0) return 0;
    return ((high - low) / high * 100).round();
  }

  int get inStockCount => listings.where((l) => l.inStock).length;
}

class AIAnalysis {
  final String bestValue;
  final String summary;
  final String priceInsight;
  final String recommendation;
  final int savingsPercentage;

  const AIAnalysis({
    required this.bestValue,
    required this.summary,
    required this.priceInsight,
    required this.recommendation,
    required this.savingsPercentage,
  });

  factory AIAnalysis.fromJson(Map<String, dynamic> json) => AIAnalysis(
        bestValue: json['bestValue'] ?? '',
        summary: json['summary'] ?? '',
        priceInsight: json['priceInsight'] ?? '',
        recommendation: json['recommendation'] ?? '',
        savingsPercentage: json['savingsPercentage'] ?? 0,
      );
}

class TrendingItem {
  final int rank;
  final String name;
  final String category;
  final String searchQuery;
  final String reason;
  final String priceRange;
  final String emoji;

  const TrendingItem({
    required this.rank,
    required this.name,
    required this.category,
    required this.searchQuery,
    required this.reason,
    required this.priceRange,
    required this.emoji,
  });

  factory TrendingItem.fromJson(Map<String, dynamic> json) => TrendingItem(
        rank: json['rank'] ?? 0,
        name: json['name'] ?? '',
        category: json['category'] ?? '',
        searchQuery: json['searchQuery'] ?? '',
        reason: json['reason'] ?? '',
        priceRange: json['priceRange'] ?? '',
        emoji: json['emoji'] ?? '',
      );
}
