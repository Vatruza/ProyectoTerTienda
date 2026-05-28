import { useState } from 'react';
import './Contact.css';

const supportChannels = [
  { icon: '📍', title: 'Ubicación', text: 'Atención 100% online para todo el país.' },
  { icon: '🕐', title: 'Horario', text: 'Lunes a sábado · 9:00 a.m. - 7:00 p.m.' },
  { icon: '💬', title: 'Tiempo de respuesta', text: 'Respondemos en menos de 24 horas.' },
];

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div>
          <span className="contact-icon">📬</span>
          <h1>Contáctanos</h1>
          <p>Te ayudamos a elegir, comprar y resolver cualquier duda de tu pedido.</p>
          <div className="contact-header-badges">
            <span>Asesoría de compra</span>
            <span>Soporte rápido</span>
            <span>Atención personalizada</span>
          </div>
        </div>
        <img src="/images/banners/contact-hero.svg" alt="Atención al cliente de belleza" className="contact-hero-image" />
      </div>

      <div className="contact-content">
        <div className="contact-left">
          <div className="contact-info">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="info-card">
                <span>{channel.icon}</span>
                <h3>{channel.title}</h3>
                <p>{channel.text}</p>
              </div>
            ))}
          </div>

          <div className="social-section">
            <h3>Síguenos en redes</h3>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <span className="social-icon">📸</span>
                <div>
                  <strong>Instagram</strong>
                  <p>@tertienda</p>
                </div>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <span className="social-icon">👤</span>
                <div>
                  <strong>Facebook</strong>
                  <p>Ter Tienda</p>
                </div>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                <span className="social-icon">▶️</span>
                <div>
                  <strong>YouTube</strong>
                  <p>Ter Tienda</p>
                </div>
              </a>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <span className="social-icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+57 300 123 4567</p>
                </div>
              </a>
              <a href="mailto:hola@tertienda.com" className="social-link email">
                <span className="social-icon">✉️</span>
                <div>
                  <strong>Correo</strong>
                  <p>hola@tertienda.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-note">
            <h4>¿Necesitas una recomendación?</h4>
            <p>
              Cuéntanos tu tipo de piel y el look que buscas. Te sugerimos productos y combinaciones
              en un mensaje personalizado.
            </p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {!sent ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Envíanos un mensaje</h2>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" placeholder="Tu nombre" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="tu@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Asunto</label>
                <input type="text" id="subject" placeholder="¿En qué podemos ayudarte?" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea id="message" rows={5} placeholder="Escribe tu mensaje aquí..." required></textarea>
              </div>
              <button type="submit" className="submit-btn">💌 Enviar mensaje</button>
            </form>
          ) : (
            <div className="success-message">
              <span>✅</span>
              <h2>¡Mensaje enviado!</h2>
              <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
              <button className="reset-form-btn" onClick={() => setSent(false)}>Enviar otro mensaje</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
