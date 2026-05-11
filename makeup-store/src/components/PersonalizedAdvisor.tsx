import { useState, useEffect } from 'react';
import { fetchRecommendations } from '../services/api';
import './PersonalizedAdvisor.css';

export interface Recommendation {
  id: number;
  name: string;
  brand: string;
  description: string;
  image: string;
}

type SkinTone = 'claro' | 'medio' | 'oscuro' | null;
type SkinType = 'seca' | 'grasa' | 'mixta' | 'normal' | null;

interface PersonalizedAdvisorProps {
  onRecommendations: (recs: Recommendation[]) => void;
}

function PersonalizedAdvisor({ onRecommendations }: PersonalizedAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [skinTone, setSkinTone] = useState<SkinTone>(null);
  const [skinType, setSkinType] = useState<SkinType>(null);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Bloquear scroll del body cuando modal está abierta
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleGetRecommendations = async () => {
    if (skinTone && skinType) {
      setLoading(true);
      try {
        const data = await fetchRecommendations(skinTone, skinType);
        setRecommendations(data);
        onRecommendations(data);
        setShowResults(true);
      } catch {
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSkinTone(null);
    setSkinType(null);
    setShowResults(false);
    setRecommendations([]);
    onRecommendations([]);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className={`advisor-fab ${showResults ? 'has-results' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Asesoría personalizada"
      >
        <span className="fab-icon">💄</span>
        <span className="fab-label">Asesoría Personalizada</span>
        {showResults && <span className="fab-badge">{recommendations.length}</span>}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="advisor-overlay" onClick={() => setIsOpen(false)}>
          <div className="advisor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span>💄</span>
                <h2>Asesoría Personalizada</h2>
              </div>
              <button className="modal-close" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              {!showResults ? (
                <>
                  <p className="modal-subtitle">Descubre los productos perfectos para tu tipo de piel</p>

                  <div className="selection-group">
                    <h3>¿Cuál es tu tono de piel?</h3>
                    <div className="options-grid skin-tones">
                      <button
                        className={`option-btn tone-claro ${skinTone === 'claro' ? 'selected' : ''}`}
                        onClick={() => setSkinTone('claro')}
                      >
                        <span className="tone-circle claro"></span>
                        <span>Claro</span>
                      </button>
                      <button
                        className={`option-btn tone-medio ${skinTone === 'medio' ? 'selected' : ''}`}
                        onClick={() => setSkinTone('medio')}
                      >
                        <span className="tone-circle medio"></span>
                        <span>Medio</span>
                      </button>
                      <button
                        className={`option-btn tone-oscuro ${skinTone === 'oscuro' ? 'selected' : ''}`}
                        onClick={() => setSkinTone('oscuro')}
                      >
                        <span className="tone-circle oscuro"></span>
                        <span>Oscuro</span>
                      </button>
                    </div>
                  </div>

                  <div className="selection-group">
                    <h3>¿Cuál es tu tipo de piel?</h3>
                    <div className="options-grid skin-types">
                      <button
                        className={`option-btn ${skinType === 'seca' ? 'selected' : ''}`}
                        onClick={() => setSkinType('seca')}
                      >
                        <span className="type-icon">💧</span>
                        <span>Seca</span>
                        <small>Tirante, descamación</small>
                      </button>
                      <button
                        className={`option-btn ${skinType === 'grasa' ? 'selected' : ''}`}
                        onClick={() => setSkinType('grasa')}
                      >
                        <span className="type-icon">✨</span>
                        <span>Grasa</span>
                        <small>Brillo, poros visibles</small>
                      </button>
                      <button
                        className={`option-btn ${skinType === 'mixta' ? 'selected' : ''}`}
                        onClick={() => setSkinType('mixta')}
                      >
                        <span className="type-icon">⚖️</span>
                        <span>Mixta</span>
                        <small>Zona T grasa, mejillas secas</small>
                      </button>
                      <button
                        className={`option-btn ${skinType === 'normal' ? 'selected' : ''}`}
                        onClick={() => setSkinType('normal')}
                      >
                        <span className="type-icon">🌸</span>
                        <span>Normal</span>
                        <small>Equilibrada, sin problemas</small>
                      </button>
                    </div>
                  </div>

                  <button
                    className={`get-recommendations-btn ${skinTone && skinType ? 'active' : ''}`}
                    onClick={handleGetRecommendations}
                    disabled={!skinTone || !skinType || loading}
                  >
                    {loading ? '⏳ Cargando...' : '✨ Ver mis recomendaciones'}
                  </button>
                </>
              ) : (
                <>
                  <div className="selected-profile">
                    <span>Tu perfil: </span>
                    <span className="profile-tag">Tono {skinTone}</span>
                    <span className="profile-tag">Piel {skinType}</span>
                  </div>

                  <div className="recommendations-grid">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="recommendation-card">
                        <span className="rec-image">{rec.image}</span>
                        <div className="rec-info">
                          <span className="rec-brand">{rec.brand}</span>
                          <h4 className="rec-name">{rec.name}</h4>
                          <p className="rec-description">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="reset-btn" onClick={handleReset}>
                    🔄 Hacer otra consulta
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PersonalizedAdvisor;
