import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Descubre tu Belleza</h1>
          <p>Las mejores marcas de maquillaje en un solo lugar</p>
          <div className="hero-tags">
            <span>💄 Labiales</span>
            <span>✨ Bases</span>
            <span>🎨 Sombras</span>
            <span>🌸 Rubores</span>
          </div>
          <Link to="/productos" className="hero-cta">Ver Productos →</Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <span className="about-icon">💖</span>
          <h2>¿Quiénes Somos?</h2>
          <p className="about-lead">
            En <strong>Ter Tienda</strong> creemos que cada persona merece sentirse acompañada al elegir sus productos de belleza, sin importar dónde esté.
          </p>
          <div className="about-cards">
            <div className="about-card">
              <span>🎯</span>
              <h3>Compras Personalizadas</h3>
              <p>Nuestra asesoría inteligente analiza tu tono y tipo de piel para recomendarte los productos ideales, como si tuvieras una asesora personal a tu lado.</p>
            </div>
            <div className="about-card">
              <span>🏠</span>
              <h3>Desde Donde Estés</h3>
              <p>No necesitas ir a una tienda física para sentirte acompañada. Te guiamos en cada paso de tu compra desde la comodidad de tu hogar.</p>
            </div>
            <div className="about-card">
              <span>✨</span>
              <h3>Las Mejores Marcas</h3>
              <p>Trabajamos con marcas reconocidas mundialmente para que tengas acceso a productos de calidad, con la confianza de una selección curada para ti.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
