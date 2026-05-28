import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { getProductImageSrc, hasImageUrl } from '../utils/productImages';
import './Cart.css';

function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (items.length === 0) {
      setErrorMessage('Tu carrito está vacío. Agrega productos antes de continuar.');
      return;
    }

    if (!name.trim() || !email.trim() || !address.trim()) {
      setErrorMessage('Por favor completa todos los datos para procesar tu compra.');
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder({
        customer: {
          name: name.trim(),
          email: email.trim(),
          address: address.trim(),
        },
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      });

      setSuccessMessage(`Pedido #${order.id} guardado con éxito. Total: $${order.total.toFixed(2)}`);
      clearCart();
      setName('');
      setEmail('');
      setAddress('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear el pedido.';

      // Local cart can contain stale product IDs after DB reset/reseed.
      if (message.includes('Uno o más productos del pedido no existen')) {
        clearCart();
        setErrorMessage('Tu carrito tenía productos desactualizados. Se vació automáticamente; vuelve a agregar los productos.');
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>🛒 Mi carrito</h1>
          <p>{totalItems} artículo(s) en tu carrito</p>
        </div>
        <Link to="/productos" className="continue-shopping-btn">
          Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="primary-btn">
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map(item => (
              <article key={item.product.id} className="cart-item">
                <div className="cart-item-details">
                  <div className="cart-item-image">
                    {hasImageUrl(item.product.image) ? (
                      <img src={getProductImageSrc(item.product.name, item.product.image)} alt={item.product.name} loading="lazy" />
                    ) : (
                      <span>{item.product.image}</span>
                    )}
                  </div>
                  <div>
                    <h3>{item.product.name}</h3>
                    <p className="cart-item-brand">{item.product.brand}</p>
                    <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">
                    Subtotal: ${ (item.product.price * item.quantity).toFixed(2) }
                  </p>
                  <button type="button" className="remove-item-btn" onClick={() => removeItem(item.product.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <div className="summary-card">
              <h2>Resumen de compra</h2>
              <p>
                <span>Productos:</span>
                <span>{totalItems}</span>
              </p>
              <p>
                <span>Total:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </p>
              <button type="button" className="clear-cart-btn" onClick={clearCart} disabled={loading}>
                Vaciar carrito
              </button>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2>Finalizar compra</h2>

              {successMessage && <div className="alert success">{successMessage}</div>}
              {errorMessage && <div className="alert error">{errorMessage}</div>}

              <label>
                Nombre completo
                <input
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Ingresa tu nombre"
                  disabled={loading}
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="ejemplo@correo.com"
                  disabled={loading}
                />
              </label>

              <label>
                Dirección
                <textarea
                  value={address}
                  onChange={event => setAddress(event.target.value)}
                  placeholder="Dirección de envío"
                  disabled={loading}
                />
              </label>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Procesando pedido...' : 'Confirmar compra'}
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
