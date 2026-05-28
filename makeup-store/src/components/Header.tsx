import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">💄</span>
          <h1>Ter Tienda</h1>
        </Link>

        <nav className="nav-desktop">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Inicio</Link>
          <Link to="/productos" className={isActive('/productos') ? 'active' : ''}>Productos</Link>
          <Link to="/ofertas" className={isActive('/ofertas') ? 'active' : ''}>Ofertas</Link>
          <Link to="/favoritos" className={isActive('/favoritos') ? 'active' : ''}>Favoritos</Link>
          <Link to="/contacto" className={isActive('/contacto') ? 'active' : ''}>Contacto</Link>
          <Link to="/pedidos" className={isActive('/pedidos') ? 'active' : ''}>Pedidos</Link>
          <Link to="/carrito" className={isActive('/carrito') ? 'active cart-link' : 'cart-link'}>🛒 Carrito ({totalItems})</Link>
        </nav>

        <button 
          className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Menú de navegación"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>📍 Menú</h2>
          <button className="close-btn" onClick={toggleMenu}>×</button>
        </div>
        
        <nav className="mobile-nav">
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>🏠 Inicio</Link>
          <Link to="/productos" className={isActive('/productos') ? 'active' : ''} onClick={closeMenu}>💄 Productos</Link>
          <Link to="/ofertas" className={isActive('/ofertas') ? 'active' : ''} onClick={closeMenu}>🔥 Ofertas</Link>
          <Link to="/favoritos" className={isActive('/favoritos') ? 'active' : ''} onClick={closeMenu}>♥ Favoritos</Link>
          <Link to="/contacto" className={isActive('/contacto') ? 'active' : ''} onClick={closeMenu}>📬 Contacto</Link>
          <Link to="/pedidos" className={isActive('/pedidos') ? 'active' : ''} onClick={closeMenu}>📦 Pedidos</Link>
          <Link to="/carrito" className={isActive('/carrito') ? 'active' : ''} onClick={closeMenu}>🛒 Carrito ({totalItems})</Link>
        </nav>
      </div>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;
