import 'package:flutter/material.dart';
import '../models/models.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const ProductCard({super.key, required this.product, required this.onTap});

  Color _categoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'gaming':
        return const Color(0xFF3B82F6);
      case 'phones':
        return const Color(0xFF8B5CF6);
      case 'laptops':
        return const Color(0xFF374151);
      case 'audio':
        return const Color(0xFFF97316);
      case 'tvs':
        return const Color(0xFF14B8A6);
      case 'tablets':
        return const Color(0xFF6366F1);
      case 'wearables':
        return const Color(0xFFF43F5E);
      default:
        return const Color(0xFF6B7280);
    }
  }

  @override
  Widget build(BuildContext context) {
    final inStock = product.listings.where((l) => l.inStock).toList();
    final cheapest = inStock.isNotEmpty ? inStock.first : null;
    final color = _categoryColor(product.category);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 2)),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top image/color area
            Container(
              height: 120,
              decoration: product.hasImage
                  ? const BoxDecoration(color: Colors.white)
                  : BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color, color.withValues(alpha: 0.7)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
              child: Stack(
                children: [
                  if (product.hasImage)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Image.network(
                          product.image,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => Icon(
                            Icons.shopping_bag_outlined,
                            size: 48,
                            color: color.withValues(alpha: 0.3),
                          ),
                        ),
                      ),
                    )
                  else
                    Center(
                      child: Icon(Icons.shopping_bag_outlined,
                          size: 48, color: Colors.white.withValues(alpha: 0.3)),
                    ),
                  // Brand badge
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: product.hasImage
                            ? Colors.black.withValues(alpha: 0.6)
                            : Colors.black.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        product.brand,
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ),
                  // Savings badge
                  if (product.savingsPercent > 5)
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF22C55E),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.trending_down, size: 12, color: Colors.white),
                            const SizedBox(width: 3),
                            Text(
                              'Save ${product.savingsPercent}%',
                              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  if (cheapest != null) ...[
                    Row(
                      children: [
                        Text(
                          '${cheapest.currencySymbol} ${_formatPrice(cheapest.price)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF4F46E5),
                          ),
                        ),
                        if (cheapest.originalPrice != null) ...[
                          const SizedBox(width: 6),
                          Text(
                            '${cheapest.currencySymbol} ${_formatPrice(cheapest.originalPrice!)}',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade400,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(Icons.store_outlined, size: 15, color: Colors.grey.shade500),
                      const SizedBox(width: 4),
                      Text(
                        '${product.inStockCount} merchant${product.inStockCount != 1 ? 's' : ''}',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                      ),
                      const Spacer(),
                      Icon(Icons.compare_arrows, size: 15, color: Colors.grey.shade500),
                      const SizedBox(width: 4),
                      Text(
                        'Compare',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
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
}
