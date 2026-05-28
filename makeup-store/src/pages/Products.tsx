import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import PersonalizedAdvisor from '../components/PersonalizedAdvisor';
import type { Recommendation } from '../components/PersonalizedAdvisor';
import { fetchProducts, fetchBrands } from '../services/api';
import { useCart } from '../context/CartContext';
import { getProductImageSrc } from '../utils/productImages';
import { WISHLIST_STORAGE_KEY } from '../constants/wishlist';
import './Products.css';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('featured');
  const [priceLimit, setPriceLimit] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'number') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        const maxPrice = data.length > 0
          ? Math.ceil(Math.max(...data.map(product => product.price)))
          : 100;
        setPriceLimit(maxPrice);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    fetchBrands()
      .then(data => setBrands(data.map(b => b.name)))
      .catch(() => setBrands([]));
  }, []);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleWishlistToggle = (product: Product) => {
    setWishlistedIds(prev =>
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistedIds));
    } catch {
      // ignore storage write errors
    }
  }, [wishlistedIds]);

  const { addItem } = useCart();

  const clearFilters = () => {
    setSelectedBrands([]);
    setRecommendations([]);
    setSearchTerm('');
    setSelectedCategory('todas');
    setSortBy('featured');
    setInStockOnly(false);
    setOnlyWishlist(false);

    const maxPrice = products.length > 0
      ? Math.ceil(Math.max(...products.map(product => product.price)))
      : 100;
    setPriceLimit(maxPrice);
  };

  const maxPrice = useMemo(
    () => (products.length > 0 ? Math.ceil(Math.max(...products.map(product => product.price))) : 100),
    [products]
  );

  const categories = useMemo(() => {
    const unique = new Set(products.map(product => product.category));
    return ['todas', ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }

    if (selectedCategory !== 'todas') {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (recommendations.length > 0) {
      const recBrands = new Set(recommendations.map(recommendation => recommendation.brand));
      result = result.filter(product => recBrands.has(product.brand));
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }

    result = result.filter(product => product.price <= priceLimit);

    if (inStockOnly) {
      result = result.filter(product => product.stock == null || product.stock > 0);
    }

    if (onlyWishlist) {
      result = result.filter(product => wishlistedIds.includes(product.id));
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedBrands, selectedCategory, recommendations, searchTerm, priceLimit, inStockOnly, sortBy, onlyWishlist, wishlistedIds]);

  return (
    <>
      <div className="products-page">
        <div className="products-page-header">
          <h1>{recommendations.length > 0 ? '✨ Productos Recomendados para Ti' : '💄 Nuestros Productos'}</h1>
          <p>Encuentra tu maquillaje ideal entre las mejores marcas</p>
        </div>

        <div className="products-layout">
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>🎨 Filtrar por Marca</h3>
              {(selectedBrands.length > 0 || recommendations.length > 0 || selectedCategory !== 'todas' || searchTerm.trim() || sortBy !== 'featured' || inStockOnly || priceLimit < maxPrice) && (
                <button className="clear-filters-btn" onClick={clearFilters}>Limpiar</button>
              )}
            </div>

            <div className="search-box">
              <label htmlFor="product-search">Buscar producto</label>
              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Nombre, marca o categoría"
              />
            </div>

            <div className="filter-block">
              <span className="filter-label">Categoría</span>
              <div className="categories-chips">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <span className="filter-label">Precio máximo: ${priceLimit}</span>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={priceLimit}
                onChange={event => setPriceLimit(Number(event.target.value))}
                className="price-range"
              />
            </div>

            <label className="stock-toggle">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={event => setInStockOnly(event.target.checked)}
              />
              <span>Solo productos disponibles</span>
            </label>

            <div className="filters-list">
              {brands.map(brand => (
                <label key={brand} className="filter-brand-item">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className="filter-checkmark"></span>
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <p className="results-count">{filteredProducts.length} resultado(s)</p>
              <div className="toolbar-actions">
                <button
                  type="button"
                  className={`wishlist-filter-btn ${onlyWishlist ? 'active' : ''}`}
                  onClick={() => setOnlyWishlist(prev => !prev)}
                >
                  {onlyWishlist ? '♥ Solo favoritos' : `♡ Favoritos (${wishlistedIds.length})`}
                </button>
                <label className="sort-control">
                  Ordenar por
                  <select value={sortBy} onChange={event => setSortBy(event.target.value)}>
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre A-Z</option>
                  </select>
                </label>
              </div>
            </div>

            {selectedBrands.length > 0 && (
              <div className="active-filters">
                <span>Filtrando: </span>
                {selectedBrands.map(brand => (
                  <span key={brand} className="filter-tag" onClick={() => handleBrandToggle(brand)}>
                    {brand} ×
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addItem}
                    onQuickView={setPreviewProduct}
                    onToggleWishlist={handleWishlistToggle}
                    isWishlisted={wishlistedIds.includes(product.id)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="no-products">
                <span>💄</span>
                <p>No hay productos con los filtros seleccionados</p>
                <button className="clear-filters-btn" onClick={clearFilters}>Ver todos los productos</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewProduct && (
        <div className="quickview-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="quickview-modal" onClick={event => event.stopPropagation()}>
            <button type="button" className="quickview-close" onClick={() => setPreviewProduct(null)}>
              ×
            </button>
            <img
              src={getProductImageSrc(previewProduct.name, previewProduct.image)}
              alt={previewProduct.name}
              className="quickview-image"
            />
            <div className="quickview-content">
              <span className="quickview-brand">{previewProduct.brand}</span>
              <h3>{previewProduct.name}</h3>
              <p className="quickview-category">{previewProduct.category}</p>
              <p className="quickview-price">${previewProduct.price.toFixed(2)}</p>
              <p className="quickview-description">
                {previewProduct.description || 'Producto de alta demanda con fórmula profesional y acabado duradero.'}
              </p>
              <div className="quickview-actions">
                <button type="button" className="quickview-wishlist" onClick={() => handleWishlistToggle(previewProduct)}>
                  {wishlistedIds.includes(previewProduct.id) ? '♥ En favoritos' : '♡ Agregar a favoritos'}
                </button>
                <button type="button" className="quickview-add" onClick={() => addItem(previewProduct)}>
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PersonalizedAdvisor onRecommendations={setRecommendations} />
    </>
  );
}

export default Products;
