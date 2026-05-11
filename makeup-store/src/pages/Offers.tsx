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

  const filtered = filter === 'all' ? products : products.filter(p => p.offerType === filter);

  const offerLabel = (type: 'flash' | 'weekly' | '2x1') =>
    type === 'flash' ? '⚡ Flash' : type === '2x1' ? '🎁 2×1' : '🗓️ Semanal';

  const { addItem } = useCart();

  return (
    <div className="offers-page">
      <div className="offers-banner">
        <span className="offers-emoji">🔥</span>
        <h1>Ofertas Especiales</h1>
        <p>Aprovecha los mejores descuentos en tus productos favoritos</p>
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
        </div>
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
