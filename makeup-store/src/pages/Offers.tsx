import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import './Offers.css';

interface OfferProduct extends Product {
  originalPrice: number;
  hasDiscount: boolean;
  discount: number;
  offerType: 'flash' | 'weekly' | '2x1';
}

function Offers() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flash' | 'weekly' | '2x1'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'price-low' | 'price-high'>('featured');
  const [promoCopied, setPromoCopied] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 17 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        const offerTypes: Array<'flash' | 'weekly' | '2x1'> = ['flash', 'weekly', '2x1'];
        const withDiscount = data.map((p: Product, i: number): OfferProduct => {
          const type = offerTypes[i % 3];
          const disc = type === 'flash' ? 40 : type === '2x1' ? 50 : (i % 2 === 0 ? 25 : 15);
          return {
            ...p,
            originalPrice: p.price,
            price: +(p.price * (1 - disc / 100)).toFixed(2),
            hasDiscount: true,
            discount: disc,
            offerType: type,
          };
        });
        setProducts(withDiscount);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleCopyPromo = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText('BELLEZA20');
      }
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 2200);
    } catch {
      setPromoCopied(false);
    }
  };

  const filtered = products
    .filter(p => (filter === 'all' ? true : p.offerType === filter))
    .filter(p => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.id - b.id;
    });

  const totalSavings = filtered.reduce(
    (sum, product) => sum + (product.originalPrice - product.price),
    0
  );

  const offerLabel = (type: 'flash' | 'weekly' | '2x1') =>
    type === 'flash' ? '⚡ Flash' : type === '2x1' ? '🎁 2×1' : '🗓️ Semanal';

  const { addItem } = useCart();

  return (
    <div className="offers-page">
      <div className="offers-banner">
        <div className="offers-banner-grid">
          <div className="offers-banner-copy">
            <span className="offers-emoji">🔥</span>
            <h1>Ofertas Especiales</h1>
            <p>Aprovecha los mejores descuentos en tus productos favoritos</p>
          </div>
          <img src="/images/banners/offers-hero.svg" alt="Colección de maquillaje en oferta" className="offers-banner-image" />
        </div>
        <div className="offers-badges">
          <span className="discount-badge">Hasta 50% OFF</span>
          <span className="discount-badge">Envío gratis</span>
          <span className="discount-badge">Stock limitado</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="countdown-section">
        <h2>⏰ ¡Ofertas Flash terminan en!</h2>
        <div className="countdown-timer">
          <div className="countdown-unit">
            <span className="countdown-number">{pad(countdown.hours)}</span>
            <span className="countdown-label">Horas</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(countdown.minutes)}</span>
            <span className="countdown-label">Min</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-unit">
            <span className="countdown-number">{pad(countdown.seconds)}</span>
            <span className="countdown-label">Seg</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="promo-section">
        <div className="promo-card">
          <span>🎟️</span>
          <div>
            <h3>Código promocional</h3>
            <p>Usa el código <strong className="promo-code">BELLEZA20</strong> para un 20% extra en tu primera compra</p>
          </div>
          <button type="button" className={`promo-copy-btn ${promoCopied ? 'copied' : ''}`} onClick={handleCopyPromo}>
            {promoCopied ? 'Copiado' : 'Copiar código'}
          </button>
        </div>
      </div>

      <div className="offers-toolbar">
        <div className="offers-search">
          <label htmlFor="offers-search">Buscar</label>
          <input
            id="offers-search"
            type="search"
            placeholder="Producto, marca o categoría"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <label className="offers-sort">
          Ordenar por
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'featured' | 'discount' | 'price-low' | 'price-high')}>
            <option value="featured">Destacados</option>
            <option value="discount">Mayor descuento</option>
            <option value="price-low">Precio menor</option>
            <option value="price-high">Precio mayor</option>
          </select>
        </label>
      </div>

      <div className="offers-stats">
        <article>
          <strong>{filtered.length}</strong>
          <span>Ofertas activas</span>
        </article>
        <article>
          <strong>${totalSavings.toFixed(2)}</strong>
          <span>Ahorro potencial</span>
        </article>
        <article>
          <strong>{filter === 'all' ? 'Todas' : offerLabel(filter)}</strong>
          <span>Tipo seleccionado</span>
        </article>
      </div>

      {/* Filter Tabs */}
      <div className="offer-tabs">
        <button className={`offer-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>🛍️ Todas</button>
        <button className={`offer-tab ${filter === 'flash' ? 'active' : ''}`} onClick={() => setFilter('flash')}>⚡ Flash</button>
        <button className={`offer-tab ${filter === 'weekly' ? 'active' : ''}`} onClick={() => setFilter('weekly')}>🗓️ Semanales</button>
        <button className={`offer-tab ${filter === '2x1' ? 'active' : ''}`} onClick={() => setFilter('2x1')}>🎁 2×1</button>
      </div>

      <div className="offers-content">
        {loading ? (
          <div className="loading">Cargando ofertas...</div>
        ) : (
          <div className="offers-grid">
            {filtered.map((product) => (
              <div key={product.id} className="offer-card-wrapper">
                <span className="offer-badge">-{product.discount}%</span>
                <span className={`offer-type-badge ${product.offerType}`}>{offerLabel(product.offerType)}</span>
                <ProductCard product={product} onAddToCart={addItem} />
                <div className="original-price">
                  Antes: <s>${product.originalPrice.toFixed(2)}</s>
                </div>
                <p className="offer-savings">Ahorras ${(product.originalPrice - product.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="no-offers">
            <span>🏷️</span>
            <p>No hay ofertas disponibles en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Offers;
