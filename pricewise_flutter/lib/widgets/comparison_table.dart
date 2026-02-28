import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';

class ComparisonTable extends StatelessWidget {
  final List<ProductListing> listings;
  final String? bestValueMerchantId;

  const ComparisonTable({
    super.key,
    required this.listings,
    this.bestValueMerchantId,
  });

  @override
  Widget build(BuildContext context) {
    final cheapestPrice = listings
        .where((l) => l.inStock)
        .map((l) => l.price)
        .fold<double>(double.infinity, (a, b) => a < b ? a : b);

    return Column(
      children: listings.asMap().entries.map((entry) {
        final index = entry.key;
        final listing = entry.value;
        final isCheapest = listing.price == cheapestPrice && listing.inStock;
        final isBestValue = listing.merchantId == bestValueMerchantId && !isCheapest;

        return _MerchantRow(
          listing: listing,
          rank: index + 1,
          isCheapest: isCheapest,
          isBestValue: isBestValue,
        );
      }).toList(),
    );
  }
}

class _MerchantRow extends StatelessWidget {
  final ProductListing listing;
  final int rank;
  final bool isCheapest;
  final bool isBestValue;

  const _MerchantRow({
    required this.listing,
    required this.rank,
    required this.isCheapest,
    required this.isBestValue,
  });

  @override
  Widget build(BuildContext context) {
    final borderColor = isCheapest
        ? const Color(0xFF4ADE80)
        : isBestValue
            ? const Color(0xFF818CF8)
            : Colors.grey.shade100;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: isCheapest
            ? const Color(0xFFF0FDF4)
            : isBestValue
                ? const Color(0xFFEEF2FF)
                : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Opacity(
        opacity: listing.inStock ? 1.0 : 0.5,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              // Top: rank, merchant, badges
              Row(
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: rank == 1 && listing.inStock
                          ? const Color(0xFF22C55E)
                          : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '$rank',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: rank == 1 && listing.inStock ? Colors.white : Colors.grey.shade600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          listing.merchantName,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.star, color: Color(0xFFFBBF24), size: 14),
                            const SizedBox(width: 3),
                            Text(
                              listing.rating.toStringAsFixed(1),
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (isCheapest && listing.inStock)
                    _Badge(label: 'Lowest Price', color: const Color(0xFF22C55E)),
                  if (isBestValue && listing.inStock)
                    _Badge(label: 'Best Value', color: const Color(0xFF4F46E5)),
                ],
              ),
              const SizedBox(height: 12),
              // Price row
              Row(
                children: [
                  Text(
                    '${listing.currencySymbol} ${_formatPrice(listing.price)}',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: isCheapest && listing.inStock
                          ? const Color(0xFF16A34A)
                          : Colors.black87,
                    ),
                  ),
                  if (listing.originalPrice != null) ...[
                    const SizedBox(width: 8),
                    Text(
                      '${listing.currencySymbol} ${_formatPrice(listing.originalPrice!)}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade400,
                        decoration: TextDecoration.lineThrough,
                      ),
                    ),
                  ],
                ],
              ),
              if (listing.inStock && listing.deliveryFee > 0)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Text(
                    '+ ${listing.currencySymbol} ${_formatPrice(listing.deliveryFee)} delivery',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade400),
                  ),
                ),
              const SizedBox(height: 10),
              // Bottom row: stock, delivery, visit button
              Row(
                children: [
                  Icon(
                    listing.inStock ? Icons.check_circle : Icons.cancel,
                    size: 16,
                    color: listing.inStock ? const Color(0xFF22C55E) : Colors.red.shade300,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    listing.inStock ? 'In Stock' : 'Out of Stock',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: listing.inStock ? const Color(0xFF16A34A) : Colors.red.shade400,
                    ),
                  ),
                  if (listing.inStock) ...[
                    const SizedBox(width: 12),
                    Icon(Icons.local_shipping_outlined, size: 15, color: Colors.grey.shade500),
                    const SizedBox(width: 4),
                    Text(
                      '${listing.deliveryDays}d',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                    ),
                    if (listing.deliveryFee == 0) ...[
                      const SizedBox(width: 4),
                      const Text(
                        'FREE',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF22C55E)),
                      ),
                    ],
                  ],
                  const Spacer(),
                  if (listing.inStock)
                    SizedBox(
                      height: 34,
                      child: ElevatedButton.icon(
                        onPressed: () => _launchUrl(listing.url),
                        icon: const Icon(Icons.open_in_new, size: 14),
                        label: const Text('Visit', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4F46E5),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          elevation: 0,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatPrice(double price) {
    if (price >= 1000) {
      return price.toStringAsFixed(0).replaceAllMapped(
            RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
            (m) => '${m[1]},',
          );
    }
    return price.toStringAsFixed(price.truncateToDouble() == price ? 0 : 2);
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;

  const _Badge({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
