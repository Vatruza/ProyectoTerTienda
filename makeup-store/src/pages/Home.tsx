import { Link } from 'react-router-dom';
import './Home.css';

const featuredProducts = [
  {
    name: 'Ruby Woo Lipstick',
    badge: 'Icono de temporada',
    description: 'Color intenso, acabado clásico y larga duración para looks de día o noche.',
    image: '/images/products/lipstick.svg',
  },
  {
    name: 'Flawless Filter',
    badge: 'Glow profesional',
    description: 'Iluminación natural y cobertura ligera con efecto segunda piel.',
    image: '/images/products/foundation.svg',
  },
  {
    name: 'Naked Palette',
    badge: 'Best seller',
    description: 'Paleta versátil para crear desde looks suaves hasta acabados intensos.',
    image: '/images/products/palette.svg',
  },
];

const highlights = [
  {
    title: 'Asesoría personalizada',
    text: 'Recomendaciones inteligentes según tono y tipo de piel para compras más acertadas.',
  },
  {
    title: 'Entrega rápida',
    text: 'Preparación ágil de pedidos y seguimiento de compra para una experiencia confiable.',
  },
  {
    title: 'Selección curada',
    text: 'Catálogo con marcas reconocidas y productos elegidos por tendencia y calidad.',
  },
];

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-kicker">Colección Primavera 2026</p>
            <h1>Maquillaje que se siente como una experiencia premium</h1>
            <p>
              Descubre rutinas completas, tonos ideales para tu piel y fórmulas que elevan tu look
              desde la primera aplicación.
            </p>
            <div className="hero-actions">
              <Link to="/productos" className="hero-cta">Explorar Catálogo</Link>
              <Link to="/contacto" className="hero-secondary">Hablar con una asesora</Link>
            </div>

            <div className="hero-tags">
              <span>Envío nacional</span>
              <span>Pagos seguros</span>
              <span>Marcas top</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <img src="/images/banners/home-hero.svg" alt="" />
            <div className="hero-floating-card">
              <strong>Look recomendado</strong>
              <p>Piel luminosa + labios velvet</p>
              <span>Listo en 3 pasos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <p className="section-kicker">Favoritos del mes</p>
          <h2>Productos destacados</h2>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <article key={product.name} className="featured-card">
              <img src={product.image} alt={product.name} loading="lazy" />
              <div className="featured-card-body">
                <span>{product.badge}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="highlights-section">
        <div className="highlights-inner">
          {highlights.map((item) => (
            <article key={item.title} className="highlight-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <span className="about-icon">💖</span>
          <h2>Nuestra Propuesta</h2>
          <p className="about-lead">
            En <strong>Ter Tienda</strong> unimos asesoría, inspiración y productos reales para que cada compra se
            sienta simple, confiable y emocionante.
          </p>
          <div className="about-cards">
            <div className="about-card">
              <span>🎯</span>
              <h3>Ruta de compra guiada</h3>
              <p>Combinamos filtros inteligentes y recomendaciones personalizadas para ayudarte a elegir mejor y más rápido.</p>
            </div>
            <div className="about-card">
              <span>🚚</span>
              <h3>Compra sin fricciones</h3>
              <p>Desde el descubrimiento del producto hasta el checkout, todo el flujo está diseñado para ser ágil y claro.</p>
            </div>
            <div className="about-card">
              <span>✨</span>
              <h3>Selección con criterio</h3>
              <p>Trabajamos con líneas populares y fórmulas versátiles para cubrir looks cotidianos y ocasiones especiales.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
