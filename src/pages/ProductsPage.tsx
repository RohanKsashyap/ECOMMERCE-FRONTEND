import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  numReviews: number;
  category: string;
}

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    priceRange: 'all',
    rating: 'all',
    sort: 'newest'
  });
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...products];
    
    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under50':
          result = result.filter(product => product.price < 50);
          break;
        case '50to100':
          result = result.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '100to200':
          result = result.filter(product => product.price > 100 && product.price <= 200);
          break;
        case 'over200':
          result = result.filter(product => product.price > 200);
          break;
        default:
          break;
      }
    }
    
    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = parseInt(filters.rating);
      result = result.filter(product => product.rating >= minRating);
    }
    
    // Sorting
    switch (filters.sort) {
      case 'newest':
        // In a real app, you would sort by date
        break;
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      sort: 'newest'
    });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-6 pb-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">All Products</h1>
            <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">
              Browse our collection of high-quality products
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              className="flex items-center text-sm text-gray-700 lg:hidden"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                name="sort"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>


    

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Filters */}
            <div className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'} lg:col-span-1`}>
              <div className="sticky top-6 space-y-6">
                <div className="flex justify-between items-center lg:hidden">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Active filters */}
                {(filters.category !== 'all' || filters.priceRange !== 'all' || filters.rating !== 'all') && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900">Active Filters</h4>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                        onClick={clearFilters}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filters.category !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {filters.category}
                          <button
                            type="button"
                            className="ml-1 text-indigo-500 hover:text-indigo-600"
                            onClick={() => handleFilterChange('category', 'all')}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.priceRange !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {filters.priceRange === 'under50' && 'Under ₹50'}
                          {filters.priceRange === '50to100' && '₹50 - ₹100'}
                          {filters.priceRange === '100to200' && '₹100 - ₹200'}
                          {filters.priceRange === 'over200' && 'Over ₹200'}
                          <button
                            type="button"
                            className="ml-1 text-indigo-500 hover:text-indigo-600"
                            onClick={() => handleFilterChange('priceRange', 'all')}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filters.rating !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {`${filters.rating}+ Stars`}
                          <button
                            type="button"
                            className="ml-1 text-indigo-500 hover:text-indigo-600"
                            onClick={() => handleFilterChange('rating', 'all')}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Categories */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => toggleSection('categories')}
                    >
                      {expandedSections.categories ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.categories && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="category-all"
                          name="category"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.category === 'all'}
                          onChange={() => handleFilterChange('category', 'all')}
                        />
                        <label htmlFor="category-all" className="ml-3 text-sm text-gray-600">
                          All Categories
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="category-electronics"
                          name="category"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.category === 'electronics'}
                          onChange={() => handleFilterChange('category', 'electronics')}
                        />
                        <label htmlFor="category-electronics" className="ml-3 text-sm text-gray-600">
                          Electronics
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="category-clothing"
                          name="category"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.category === 'clothing'}
                          onChange={() => handleFilterChange('category', 'clothing')}
                        />
                        <label htmlFor="category-clothing" className="ml-3 text-sm text-gray-600">
                          Clothing
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="category-home"
                          name="category"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.category === 'home'}
                          onChange={() => handleFilterChange('category', 'home')}
                        />
                        <label htmlFor="category-home" className="ml-3 text-sm text-gray-600">
                          Home & Kitchen
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Price Range */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => toggleSection('price')}
                    >
                      {expandedSections.price ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.price && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="price-all"
                          name="price"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === 'all'}
                          onChange={() => handleFilterChange('priceRange', 'all')}
                        />
                        <label htmlFor="price-all" className="ml-3 text-sm text-gray-600">
                          All Prices
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="price-under50"
                          name="price"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === 'under50'}
                          onChange={() => handleFilterChange('priceRange', 'under50')}
                        />
                        <label htmlFor="price-under50" className="ml-3 text-sm text-gray-600">
                          Under ₹50
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="price-50to100"
                          name="price"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === '50to100'}
                          onChange={() => handleFilterChange('priceRange', '50to100')}
                        />
                        <label htmlFor="price-50to100" className="ml-3 text-sm text-gray-600">
                          ₹50 - ₹100
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="price-100to200"
                          name="price"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === '100to200'}
                          onChange={() => handleFilterChange('priceRange', '100to200')}
                        />
                        <label htmlFor="price-100to200" className="ml-3 text-sm text-gray-600">
                          ₹100 - ₹200
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="price-over200"
                          name="price"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === 'over200'}
                          onChange={() => handleFilterChange('priceRange', 'over200')}
                        />
                        <label htmlFor="price-over200" className="ml-3 text-sm text-gray-600">
                          Over ₹200
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Rating */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => toggleSection('rating')}
                    >
                      {expandedSections.rating ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.rating && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <input
                          id="rating-all"
                          name="rating"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.rating === 'all'}
                          onChange={() => handleFilterChange('rating', 'all')}
                        />
                        <label htmlFor="rating-all" className="ml-3 text-sm text-gray-600">
                          All Ratings
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="rating-4"
                          name="rating"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.rating === '4'}
                          onChange={() => handleFilterChange('rating', '4')}
                        />
                        <label htmlFor="rating-4" className="ml-3 text-sm text-gray-600 flex items-center">
                          <div className="flex text-yellow-400 mr-1">
                            {[...Array(4)].map((_, i) => (
                              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          & Up
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="rating-3"
                          name="rating"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.rating === '3'}
                          onChange={() => handleFilterChange('rating', '3')}
                        />
                        <label htmlFor="rating-3" className="ml-3 text-sm text-gray-600 flex items-center">
                          <div className="flex text-yellow-400 mr-1">
                            {[...Array(3)].map((_, i) => (
                              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          & Up
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="rating-2"
                          name="rating"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.rating === '2'}
                          onChange={() => handleFilterChange('rating', '2')}
                        />
                        <label htmlFor="rating-2" className="ml-3 text-sm text-gray-600 flex items-center">
                          <div className="flex text-yellow-400 mr-1">
                            {[...Array(2)].map((_, i) => (
                              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          & Up
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;