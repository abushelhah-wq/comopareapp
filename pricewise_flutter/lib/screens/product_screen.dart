import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../services/app_state.dart';
import '../widgets/comparison_table.dart';
import '../widgets/ai_insight_panel.dart';
import '../widgets/country_selector.dart';

class ProductScreen extends StatefulWidget {
  final Product product;

  const ProductScreen({super.key, required this.product});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  AIAnalysis? _analysis;
  bool _analyzing = true;

  @override
  void initState() {
    super.initState();
    _loadAnalysis();
  }

  Future<void> _loadAnalysis() async {
    setState(() => _analyzing = true);
    try {
      final analysis = await context.read<AppState>().analyzeProduct(widget.product);
      if (mounted) {
        setState(() {
          _analysis = analysis;
          _analyzing = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _analyzing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    final inStock = product.listings.where((l) => l.inStock).toList();
    final cheapest = inStock.isNotEmpty ? inStock.first : null;
    final mostExpensive = inStock.isNotEmpty ? inStock.last : null;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          // App bar
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: product.hasImage ? Colors.white : const Color(0xFF4F46E5),
            foregroundColor: product.hasImage ? const Color(0xFF4F46E5) : Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              background: product.hasImage
                  ? Container(
                      color: Colors.white,
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 40, left: 24, right: 24, bottom: 16),
                          child: Image.network(
                            product.image,
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => Icon(
                              Icons.shopping_bag_outlined,
                              size: 56,
                              color: const Color(0xFF4F46E5).withValues(alpha: 0.3),
                            ),
                          ),
                        ),
                      ),
                    )
                  : Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Icon(Icons.shopping_bag_outlined,
                          size: 56, color: Colors.white.withValues(alpha: 0.3)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          product.category,
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product info card
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(product.brand,
                            style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
                        const SizedBox(height: 4),
                        Text(product.name,
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Text(product.description,
                            style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.4)),
                        const SizedBox(height: 18),
                        // Quick stats
                        Row(
                          children: [
                            _StatBox(
                              label: 'Lowest',
                              value: cheapest != null
                                  ? '${cheapest.currencySymbol} ${_formatPrice(cheapest.price)}'
                                  : 'N/A',
                              color: const Color(0xFF16A34A),
                            ),
                            const SizedBox(width: 10),
                            _StatBox(
                              label: 'Highest',
                              value: mostExpensive != null
                                  ? '${mostExpensive.currencySymbol} ${_formatPrice(mostExpensive.price)}'
                                  : 'N/A',
                              color: Colors.grey.shade700,
                            ),
                            const SizedBox(width: 10),
                            _StatBox(
                              label: 'Merchants',
                              value: '${product.inStockCount}',
                              color: const Color(0xFF4F46E5),
                            ),
                            const SizedBox(width: 10),
                            _StatBox(
                              label: 'You Save',
                              value: cheapest != null && mostExpensive != null
                                  ? '${cheapest.currencySymbol} ${_formatPrice(mostExpensive.price - cheapest.price)}'
                                  : 'N/A',
                              color: const Color(0xFF16A34A),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // AI Analysis
                  AIInsightPanel(analysis: _analysis, loading: _analyzing),

                  const SizedBox(height: 20),

                  // Comparison Table Header
                  Row(
                    children: [
                      const Icon(Icons.bar_chart, color: Color(0xFF4F46E5), size: 20),
                      const SizedBox(width: 8),
                      const Text('Price Comparison',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 8),
                      Text(
                        '${product.listings.length} merchants',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade400),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Comparison Table
                  ComparisonTable(
                    listings: product.listings,
                    bestValueMerchantId: _analysis?.bestValue,
                  ),

                  const SizedBox(height: 24),

                  // Country switcher
                  Consumer<AppState>(
                    builder: (context, state, _) {
                      return Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFEEF2FF), Color(0xFFF5F3FF)],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFC7D2FE)),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.public, color: Color(0xFF818CF8), size: 30),
                            const SizedBox(height: 8),
                            const Text(
                              'Compare in a different country?',
                              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'See how prices differ across regions',
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  showModalBottomSheet(
                                    context: context,
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                    builder: (_) => CountrySelectorSheet(
                                      selectedCode: state.selectedCountryCode,
                                      onChanged: (code) {
                                        state.setCountry(code);
                                        Navigator.pop(context);
                                        // Re-search from search screen
                                      },
                                    ),
                                  );
                                },
                                icon: Text(state.selectedCountry.flag, style: const TextStyle(fontSize: 18)),
                                label: Text('Currently: ${state.selectedCountry.name}'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: const Color(0xFF4F46E5),
                                  elevation: 0,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    side: const BorderSide(color: Color(0xFFC7D2FE)),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
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

class _StatBox extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatBox({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Text(label, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
            const SizedBox(height: 3),
            Text(
              value,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
