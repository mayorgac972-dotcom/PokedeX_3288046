import React from 'react';
import { Volume2, Plus, Check, Sparkles } from 'lucide-react';
import { POKEMON_TYPES } from '../utils/pokemonConstants';
import { useTrainer } from '../context/TrainerContext';

export default function PokemonCard({ pokemon, onSelect, onQuickCatch }) {
  const { isInBackpack } = useTrainer();
  const captured = isInBackpack(pokemon.id);

  const primaryType = pokemon.types[0] || 'normal';
  const typeStyle = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

  const handlePlayCry = (e) => {
    e.stopPropagation();
    if (pokemon.cryAudio) {
      const audio = new Audio(pokemon.cryAudio);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio playback prevented:', err));
    }
  };

  const handleCatchClick = (e) => {
    e.stopPropagation();
    onQuickCatch(pokemon);
  };

  return (
    <div
      className="pokemon-card"
      onClick={() => onSelect(pokemon)}
      style={{
        '--card-glow': typeStyle.color,
        '--card-bg-subtle': typeStyle.bg
      }}
    >
      <div className="card-top">
        <span className="card-id">{pokemon.formattedId}</span>
        <div className="card-top-actions">
          {pokemon.cryAudio && (
            <button
              className="card-icon-btn"
              onClick={handlePlayCry}
              title="Escuchar sonido / grito"
            >
              <Volume2 size={16} />
            </button>
          )}
          <button
            className={`card-catch-btn ${captured ? 'captured' : ''}`}
            onClick={handleCatchClick}
            title={captured ? 'Ya está en tu mochila' : 'Capturar para la mochila'}
          >
            {captured ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>

      <div className="card-image-container">
        <div className="card-image-bg"></div>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="card-image"
          loading="lazy"
        />
      </div>

      <div className="card-bottom">
        <h3 className="card-name">{pokemon.name}</h3>

        <div className="card-types">
          {pokemon.types.map(t => {
            const tInfo = POKEMON_TYPES[t] || { name: t, color: '#666' };
            return (
              <span
                key={t}
                className="type-tag"
                style={{ backgroundColor: tInfo.color }}
              >
                {tInfo.name}
              </span>
            );
          })}
        </div>

        <div className="card-quick-stats">
          <div className="quick-stat">
            <span className="qs-label">Total Base</span>
            <span className="qs-value">{pokemon.totalStats}</span>
          </div>
          <div className="quick-stat">
            <span className="qs-label">Altura</span>
            <span className="qs-value">{pokemon.height} m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
