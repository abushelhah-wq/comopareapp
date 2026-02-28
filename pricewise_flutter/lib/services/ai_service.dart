import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';
import '../models/data.dart';

class AIService {
  static const String _baseUrl = 'https://api.anthropic.com/v1/messages';
  static const String _model = 'claude-sonnet-4-20250514';

  final String apiKey;

  AIService({required this.apiKey});

  Future<Map<String, dynamic>> _callClaude(String prompt, {int maxTokens = 4096}) async {
    final response = await http.post(
      Uri.parse(_baseUrl),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: jsonEncode({
        'model': _model,
        'max_tokens': maxTokens,
        'messages': [
          {'role': 'user', 'content': prompt},
        ],
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('API error: ${response.statusCode} - ${response.body}');
    }

    final data = jsonDecode(response.body);
    final text = data['content'][0]['text'] as String;

    return {'text': text};
  }

  List<dynamic>? _extractJsonArray(String text) {
    final match = RegExp(r'\[[\s\S]*\]').firstMatch(text);
    if (match == null) return null;
    try {
      return jsonDecode(match.group(0)!) as List<dynamic>;
    } catch (_) {
      return null;
    }
  }

  Map<String, dynamic>? _extractJsonObject(String text) {
    final match = RegExp(r'\{[\s\S]*\}').firstMatch(text);
    if (match == null) return null;
    try {
      return jsonDecode(match.group(0)!) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<List<Product>> search(String query, String countryCode) async {
    final country = getCountryByCode(countryCode);
    final countryMerchants = getMerchantsByCountry(countryCode);

    if (countryMerchants.isEmpty) return [];

    final merchantList =
        countryMerchants.map((m) => '- ${m.id}: "${m.name}" (rating: ${m.rating})').join('\n');

    final result = await _callClaude('''You are a price comparison engine. A user in ${country.name} is searching for: "$query"

Available merchants in ${country.name}:
$merchantList

Currency: ${country.currency} (${country.currencySymbol})

Return a JSON array of products that match this search query. For each product, provide realistic market prices in ${country.currency} from the available merchants. Prices should reflect real-world pricing for ${country.name} market as accurately as possible.

IMPORTANT RULES:
- Return 1-5 products that best match the search query
- Each product must have prices from ALL available merchants listed above
- Prices should vary between merchants (realistic price differences of 2-15%)
- Some items may have original/sale prices
- Most items should be in stock (set a few to out of stock for realism)
- Delivery days: 1-7 days, delivery fee: 0 for expensive items, small fee for cheaper ones
- Product IDs should be kebab-case slugs (e.g., "iphone-16-pro-max-256gb")
- Be realistic with pricing for the ${country.name} market
- For imageUrl, provide a REAL working product image URL from the manufacturer's official website, a major CDN, or a well-known public product image source. The image must be directly accessible (not behind authentication). If unsure, use an empty string.

Respond ONLY with a valid JSON array, no other text. Use this exact structure:
[
  {
    "id": "product-slug-id",
    "name": "Full Product Name",
    "category": "Category",
    "brand": "Brand",
    "imageUrl": "https://example.com/product-image.jpg",
    "description": "Short product description",
    "merchants": [
      {
        "merchantId": "merchant-id-from-list",
        "price": 1999.99,
        "originalPrice": 2199.99,
        "inStock": true,
        "deliveryDays": 3,
        "deliveryFee": 0,
        "rating": 4.5
      }
    ]
  }
]''');

    final parsed = _extractJsonArray(result['text']!);
    if (parsed == null) return [];

    return parsed.map<Product>((item) {
      final merchantData = item['merchants'] as List<dynamic>? ?? [];
      final productImage = item['imageUrl'] as String? ?? '';

      final listings = merchantData.map<ProductListing?>((m) {
        final merchant = countryMerchants
            .where((cm) => cm.id == m['merchantId'])
            .firstOrNull;
        if (merchant == null) return null;

        return ProductListing(
          id: '${item['id']}-${m['merchantId']}',
          merchantId: m['merchantId'],
          merchantName: merchant.name,
          productName: item['name'],
          price: (m['price'] ?? 0).toDouble(),
          originalPrice: m['originalPrice']?.toDouble(),
          currency: country.currency,
          currencySymbol: country.currencySymbol,
          url: merchant.buildSearchUrl(item['name'] as String),
          inStock: m['inStock'] ?? true,
          rating: (m['rating'] ?? 4.0).toDouble(),
          deliveryDays: m['deliveryDays'] ?? 3,
          deliveryFee: (m['deliveryFee'] ?? 0).toDouble(),
        );
      }).whereType<ProductListing>().toList();

      listings.sort((a, b) => a.price.compareTo(b.price));

      return Product(
        id: item['id'],
        name: item['name'],
        category: item['category'] ?? '',
        brand: item['brand'] ?? '',
        description: item['description'] ?? '',
        image: productImage,
        listings: listings,
      );
    }).toList();
  }

  Future<AIAnalysis> analyzeProduct(Product product) async {
    final inStockListings = product.listings.where((l) => l.inStock).toList();

    if (inStockListings.isEmpty) {
      return const AIAnalysis(
        bestValue: '',
        summary: 'This product is currently out of stock at all merchants.',
        priceInsight: 'No pricing data available.',
        recommendation: 'Check back later for availability.',
        savingsPercentage: 0,
      );
    }

    final listingsSummary = inStockListings
        .map((l) =>
            '${l.merchantName}: ${l.currencySymbol} ${l.price} (delivery: ${l.deliveryDays} days, fee: ${l.deliveryFee}, rating: ${l.rating})')
        .join('\n');

    try {
      final result = await _callClaude('''You are a smart shopping advisor. Analyze these merchant prices for "${product.name}" and provide insights.

Merchant prices:
$listingsSummary

Respond ONLY with valid JSON using this exact structure:
{
  "bestValue": "merchant-id-of-best-overall-value",
  "summary": "A 1-2 sentence summary of the price comparison",
  "priceInsight": "A specific insight about pricing trends, gaps, or notable findings",
  "recommendation": "A clear, actionable recommendation for the buyer",
  "savingsPercentage": 12
}

The bestValue should be the merchantId that offers the best combination of price, delivery speed, and reliability. The savingsPercentage is the % difference between cheapest and most expensive.''',
          maxTokens: 1024);

      final parsed = _extractJsonObject(result['text']!);
      if (parsed == null) throw Exception('Parse failed');
      return AIAnalysis.fromJson(parsed);
    } catch (_) {
      final cheapest = inStockListings.first;
      final mostExpensive = inStockListings.last;
      final savings = mostExpensive.price > 0
          ? ((mostExpensive.price - cheapest.price) / mostExpensive.price * 100).round()
          : 0;

      return AIAnalysis(
        bestValue: cheapest.merchantId,
        summary: 'Compared ${inStockListings.length} merchants for ${product.name}.',
        priceInsight: 'There is a $savings% price difference.',
        recommendation: '${cheapest.merchantName} offers the lowest price.',
        savingsPercentage: savings,
      );
    }
  }

  Future<List<TrendingItem>> getTrending(String countryCode) async {
    final country = getCountryByCode(countryCode);
    final countryMerchants = getMerchantsByCountry(countryCode);
    final merchantNames = countryMerchants.map((m) => m.name).join(', ');

    final result = await _callClaude('''You are a market trends analyst. What are the top 8 most searched/trending products that people in ${country.name} are currently looking to buy online in 2025?

Consider:
- Products popular in ${country.name} specifically (cultural preferences, local demand)
- Seasonal trends and new releases
- Products commonly compared on price comparison sites
- Available at merchants like: $merchantNames

Return ONLY a valid JSON array with this structure:
[
  {
    "rank": 1,
    "name": "Product Name",
    "category": "Category",
    "searchQuery": "exact search query to find this product",
    "reason": "Short reason why it's trending (10-15 words max)",
    "priceRange": "approximate price range in ${country.currency}",
    "emoji": "single relevant emoji"
  }
]

Make it diverse — mix electronics, lifestyle, home, fashion etc. Be specific with product names.''',
        maxTokens: 2048);

    final parsed = _extractJsonArray(result['text']!);
    if (parsed == null) return [];

    return parsed.map<TrendingItem>((item) => TrendingItem.fromJson(item)).toList();
  }
}
