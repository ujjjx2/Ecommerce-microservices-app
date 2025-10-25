import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export default function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    productService.getAll()
      .then(res => {
        setProducts(res.data);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
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
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              {product.stock < 10 && product.stock > 0 && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                  Only {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="p-4">
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase mb-1">{product.brand}</p>
              )}
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating.toFixed(1)})</span>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`px-4 py-2 rounded transition duration-200 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
