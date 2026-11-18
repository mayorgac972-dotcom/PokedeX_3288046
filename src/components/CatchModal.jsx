import React, { useState } from 'react';
import { X, Sparkles, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTrainer } from '../context/TrainerContext';
import { POKEMON_TYPES } from '../utils/pokemonConstants';

export default function CatchModal({ pokemon, initialShiny = false, onClose, onSuccess }) {
  const { activeTrainer, addToBackpack } = useTrainer();
  const [nickname, setNickname] = useState('');
  const [isShiny, setIsShiny] = useState(initialShiny);
  const [level, setLevel] = useState(Math.floor(Math.random() * 20) + 10);
  const [isThrowing, setIsThrowing] = useState(false);

  if (!pokemon) return null;

  const currentImg = isShiny ? (pokemon.shinyImage || pokemon.image) : pokemon.image;
  const primaryType = pokemon.types[0] || 'normal';
  const typeStyle = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

  const handleCatch = (e) => {
    e.preventDefault();
    setIsThrowing(true);

    // Reproducir cry si existe
    if (pokemon.cryAudio) {
      const audio = new Audio(pokemon.cryAudio);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }

    setTimeout(() => {
      // Confetti celebratory explosion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      addToBackpack(pokemon, {
        nickname: nickname.trim() || pokemon.name,
        isShiny,
        level: Number(level) || 15
      });

      setIsThrowing(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content catch-modal"
        onClick={e => e.stopPropagation()}
        style={{
          '--modal-accent': typeStyle.color
        }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="catch-header">
          <div className="pokeball-catch-icon animate-pulse"></div>
          <h2>¡Capturar a {pokemon.name}!</h2>
          <p className="catch-subtitle">
            Se guardará en la mochila de <strong>{activeTrainer.name}</strong>
          </p>
        </div>

        <div className="catch-preview">
          <img
            src={currentImg}
            alt={pokemon.name}
            className={`catch-preview-img ${isThrowing ? 'catch-animating' : ''}`}
          />
        </div>

        <form onSubmit={handleCatch} className="catch-form">
          <div className="form-group">
            <label htmlFor="nickname">Apodo personalizado (opcional)</label>
            <input
              id="nickname"
              type="text"
              placeholder={`Ej: ${pokemon.name}`}
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="level">Nivel inicial: {level}</label>
              <input
                id="level"
                type="range"
                min="1"
                max="100"
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="form-range"
              />
            </div>

            <div className="form-group shiny-toggle-group">
              <label>Variocolor (Shiny)</label>
              <button
                type="button"
                className={`shiny-checkbox-btn ${isShiny ? 'active' : ''}`}
                onClick={() => setIsShiny(!isShiny)}
              >
                <Sparkles size={16} />
                <span>{isShiny ? 'Shiny' : 'Normal'}</span>
              </button>
            </div>
          </div>

          <div className="catch-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isThrowing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-catch-submit"
              disabled={isThrowing}
            >
              <div className="mini-pokeball"></div>
              <span>{isThrowing ? '¡Lanzando Pokéball...!' : '¡Lanzar Pokéball!'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
