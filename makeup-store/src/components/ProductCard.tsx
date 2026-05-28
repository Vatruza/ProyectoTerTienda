import './ProductCard.css';
import { getProductImageSrc } from '../utils/productImages';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

function ProductCard({ product, onAddToCart, onQuickView, onToggleWishlist, isWishlisted = false }: ProductCardProps) {
  const imageSrc = getProductImageSrc(product.name, product.image);
  const rating = (4 + (product.id % 8) * 0.1).toFixed(1);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageSrc} alt={product.name} loading="lazy" />
        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => onToggleWishlist?.(product)}
          aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
        <span className={`stock-badge ${product.stock === 0 ? 'sold-out' : ''}`}>
          {product.stock === 0 ? 'Agotado' : 'Disponible'}
        </span>
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-rating">⭐ {rating} · Compra segura</p>
        <button type="button" className="quick-view-btn" onClick={() => onQuickView?.(product)}>
          Vista rápida
        </button>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={() => onAddToCart?.(product)}>
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
