import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { WISHLIST_STORAGE_KEY } from '../constants/wishlist';
import './Favorites.css';

function Favorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WISHLIST_STORAGE_KEY) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : [];
        setWishlistedIds(Array.isArray(parsed) ? parsed.filter((item: unknown) => typeof item === 'number') : []);
      } catch {
        setWishlistedIds([]);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const favoriteProducts = useMemo(
    () => products.filter(product => wishlistedIds.includes(product.id)),
    [products, wishlistedIds]
  );

  const handleToggleWishlist = (product: Product) => {
    setWishlistedIds(prev => {
      const next = prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id];

      try {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore localStorage write errors
      }

      return next;
    });
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>♥ Mis Favoritos</h1>
        <p>Guarda tus productos preferidos y agrégalos al carrito en un clic.</p>
        <div className="favorites-stats">
          <span>{favoriteProducts.length} favorito(s)</span>
          <Link to="/productos">Ver catálogo completo</Link>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando favoritos...</div>
      ) : favoriteProducts.length === 0 ? (
        <div className="favorites-empty">
          <span>💗</span>
          <h2>Aún no tienes favoritos</h2>
          <p>Explora productos y marca con ♥ los que quieras volver a ver.</p>
          <Link to="/productos" className="favorites-empty-btn">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addItem}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;