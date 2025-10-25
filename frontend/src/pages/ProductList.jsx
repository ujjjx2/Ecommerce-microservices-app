import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import ProductRecommendationModal from '../components/ProductRecommendationModal';

export default function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    productService.getAll()
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        result = result.filter(product => product.price >= min && product.price <= max);
      } else {
        result = result.filter(product => product.price >= min);
      }
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('default');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-12 max-w-md mx-auto shadow-xl">
          <div className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Amazing Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Find exactly what you're looking for</p>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white"
            >
              <option value="all">All Prices</option>
              <option value="0-10">Under $10</option>
              <option value="10-25">$10 - $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100">$100+</option>
            </select>
          </div>

          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-white"
            >
              <option value="default">Featured</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
          
          {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'default') && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/50 dark:hover:to-pink-900/50 text-red-600 dark:text-red-400 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 animate-slide-up">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-3">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {product.stock < 10 && product.stock > 0 && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    Only {product.stock} left!
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="p-5">
                {product.brand && (
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{product.brand}</p>
                )}
                
                <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-lg">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                      product.stock === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    }`}
                  >
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Recommendation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductRecommendationModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
