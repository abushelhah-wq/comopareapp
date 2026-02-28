import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../models/data.dart' as data;
import 'ai_service.dart';

class AppState extends ChangeNotifier {
  final AIService _aiService;

  String _selectedCountryCode = 'SA';
  List<Product> _searchResults = [];
  List<TrendingItem> _trending = [];
  bool _isSearching = false;
  bool _isTrendingLoading = false;
  String? _searchError;
  String? _trendingError;
  String _lastQuery = '';

  AppState({required String apiKey}) : _aiService = AIService(apiKey: apiKey);

  // Getters
  String get selectedCountryCode => _selectedCountryCode;
  Country get selectedCountry => data.getCountryByCode(_selectedCountryCode);
  List<Product> get searchResults => _searchResults;
  List<TrendingItem> get trending => _trending;
  bool get isSearching => _isSearching;
  bool get isTrendingLoading => _isTrendingLoading;
  String? get searchError => _searchError;
  String? get trendingError => _trendingError;
  String get lastQuery => _lastQuery;

  void setCountry(String code) {
    _selectedCountryCode = code;
    notifyListeners();
    loadTrending();
  }

  Future<void> search(String query) async {
    _lastQuery = query;
    _isSearching = true;
    _searchError = null;
    _searchResults = [];
    notifyListeners();

    try {
      _searchResults = await _aiService.search(query, _selectedCountryCode);
      _searchError = null;
    } catch (e) {
      _searchError = 'Search failed. Please try again.';
    }

    _isSearching = false;
    notifyListeners();
  }

  Future<AIAnalysis> analyzeProduct(Product product) async {
    return _aiService.analyzeProduct(product);
  }

  Future<List<Product>> searchForProduct(String name) async {
    return _aiService.search(name, _selectedCountryCode);
  }

  Future<void> loadTrending() async {
    _isTrendingLoading = true;
    _trendingError = null;
    notifyListeners();

    try {
      _trending = await _aiService.getTrending(_selectedCountryCode);
    } catch (e) {
      _trendingError = 'Could not load trends';
    }

    _isTrendingLoading = false;
    notifyListeners();
  }
}
