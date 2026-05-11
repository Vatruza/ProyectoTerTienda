import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import PersonalizedAdvisor from '../components/PersonalizedAdvisor';
import type { Recommendation } from '../components/PersonalizedAdvisor';
import { fetchProducts, fetchBrands } from '../services/api';
import { useCart } from '../context/CartContext';
import './Products.css';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
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

  const { addItem } = useCart();

  const clearFilters = () => {
    setSelectedBrands([]);
    setRecommendations([]);
  };

  let filteredProducts = selectedBrands.length > 0
    ? products.filter(p => selectedBrands.includes(p.brand))
    : products;

  if (recommendations.length > 0) {
    const recBrands = new Set(recommendations.map(r => r.brand));
    filteredProducts = filteredProducts.filter(p => recBrands.has(p.brand));
  }

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
              {(selectedBrands.length > 0 || recommendations.length > 0) && (
                <button className="clear-filters-btn" onClick={clearFilters}>Limpiar</button>
              )}
            </div>
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
                  <ProductCard key={product.id} product={product} onAddToCart={addItem} />
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

      <PersonalizedAdvisor onRecommendations={setRecommendations} />
    </>
  );
}

export default Products;
