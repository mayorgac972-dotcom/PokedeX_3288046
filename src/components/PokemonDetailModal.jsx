import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Plus, Check, Shield, Zap, Heart, Swords } from 'lucide-react';
import { POKEMON_TYPES, STAT_NAMES } from '../utils/pokemonConstants';
import { getPokemonSpecies } from '../services/pokeApi';
import { useTrainer } from '../context/TrainerContext';

export default function PokemonDetailModal({ pokemon, onClose, onCatch }) {
  const { isInBackpack } = useTrainer();
  const [species, setSpecies] = useState(null);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  const captured = isInBackpack(pokemon?.id);
  const primaryType = pokemon?.types[0] || 'normal';
  const typeStyle = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

  useEffect(() => {
    if (!pokemon) return;
    let isMounted = true;
    setLoadingSpecies(true);

    getPokemonSpecies(pokemon.id).then(data => {
      if (isMounted) {
        setSpecies(data);
        setLoadingSpecies(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pokemon]);

  if (!pokemon) return null;

  const playCry = () => {
    if (!pokemon.cryAudio) return;
    setIsPlayingCry(true);
    const audio = new Audio(pokemon.cryAudio);
    audio.volume = 0.6;
    audio.onended = () => setIsPlayingCry(false);
    audio.onerror = () => setIsPlayingCry(false);
    audio.play().catch(() => setIsPlayingCry(false));
  };

  const currentDisplayImage = isShiny
    ? (pokemon.shinyImage || pokemon.image)
    : (pokemon.image || pokemon.shinyImage);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content pokemon-detail-modal"
        onClick={e => e.stopPropagation()}
        style={{
          '--modal-accent': typeStyle.color,
          '--modal-accent-bg': typeStyle.bg
        }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {/* Encabezado */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-id">{pokemon.formattedId}</span>
            <h2 className="modal-name">{pokemon.name}</h2>
            {species?.category && (
              <span className="modal-category">{species.category}</span>
            )}
          </div>
          <div className="modal-types">
            {pokemon.types.map(t => {
              const tInfo = POKEMON_TYPES[t] || { name: t, color: '#888' };
              return (
                <span
                  key={t}
                  className="type-tag large"
                  style={{ backgroundColor: tInfo.color }}
                >
                  {tInfo.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Sección Visual Central */}
        <div className="modal-visual-row">
          <div className="modal-image-showcase">
            <div className="showcase-bg"></div>
            <img
              src={currentDisplayImage}
              alt={pokemon.name}
              className="showcase-image"
            />

            <div className="visual-controls">
              <button
                className={`visual-ctrl-btn ${isShiny ? 'active' : ''}`}
                onClick={() => setIsShiny(!isShiny)}
                title="Alternar versión Variocolor (Shiny)"
              >
                <Sparkles size={16} />
                <span>{isShiny ? 'Shiny ON' : 'Normal'}</span>
              </button>

              {pokemon.cryAudio && (
                <button
                  className={`visual-ctrl-btn ${isPlayingCry ? 'playing' : ''}`}
                  onClick={playCry}
                  title="Reproducir sonido oficial del Pokémon"
                >
                  <Volume2 size={16} />
                  <span>Sonido</span>
                </button>
              )}
            </div>
          </div>

          <div className="modal-specs-column">
            {/* Descripción en Español */}
            <div className="modal-description-box">
              <h4 className="box-title">Entrada de la Pokédex</h4>
              {loadingSpecies ? (
                <p className="description-loading">Sintonizando datos de la Pokédex...</p>
              ) : (
                <p className="description-text">
                  "{species?.description || 'No hay registro de texto disponible.'}"
                </p>
              )}
            </div>

            {/* Medidas y Habilidades */}
            <div className="specs-grid">
              <div className="spec-card">
                <span className="spec-label">Altura</span>
                <span className="spec-val">{pokemon.height} m</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Peso</span>
                <span className="spec-val">{pokemon.weight} kg</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Exp. Base</span>
                <span className="spec-val">{pokemon.baseExperience || 'N/A'}</span>
              </div>
            </div>

            <div className="abilities-box">
              <span className="spec-label">Habilidades:</span>
              <div className="abilities-list">
                {pokemon.abilities.map(a => (
                  <span key={a.name} className="ability-pill">
                    {a.name}
                    {a.isHidden && <small className="hidden-badge">Oculta</small>}
                  </span>
                ))}
              </div>
            </div>

            {/* Botón de Acción en Mochila */}
            <div className="modal-backpack-action">
              <button
                className={`action-catch-btn ${captured ? 'already-caught' : ''}`}
                onClick={() => onCatch(pokemon, { isShiny })}
              >
                {captured ? (
                  <>
                    <Check size={20} />
                    <span>¡En tu Mochila! (Capturar otro)</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Guardar en Mochila de Entrenador</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Base */}
        <div className="modal-stats-section">
          <div className="stats-section-header">
            <h3>Estadísticas Base</h3>
            <span className="total-stats-pill">
              Total: <strong>{pokemon.totalStats}</strong>
            </span>
          </div>

          <div className="stats-grid">
            {pokemon.stats.map(s => {
              const maxVal = 255;
              const percentage = Math.min(100, Math.round((s.base / maxVal) * 100));
              const translatedName = STAT_NAMES[s.name] || s.name;

              let color = '#ef4444';
              if (s.base >= 100) color = '#10b981';
              else if (s.base >= 70) color = '#3b82f6';
              else if (s.base >= 50) color = '#f59e0b';

              return (
                <div key={s.name} className="stat-row">
                  <span className="stat-name">{translatedName}</span>
                  <span className="stat-number">{s.base}</span>
                  <div className="stat-bar-container">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
