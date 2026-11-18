import React, { useState } from 'react';
import {
  Shield,
  Heart,
  Volume2,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Star,
  Sparkles,
  Inbox,
  Plus
} from 'lucide-react';
import { useTrainer } from '../context/TrainerContext';
import { POKEMON_TYPES } from '../utils/pokemonConstants';

export default function BackpackView({ onGoToPokedex }) {
  const {
    activeTrainer,
    removeFromBackpack,
    moveToTeam,
    moveToBox,
    updateBackpackPokemon
  } = useTrainer();

  const [boxSearch, setBoxSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const team = activeTrainer?.backpack?.team || [];
  const box = activeTrainer?.backpack?.box || [];

  const handlePlayCry = (cryAudio) => {
    if (cryAudio) {
      const audio = new Audio(cryAudio);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  const handleToggleFavorite = (uniqueId, currentFav) => {
    updateBackpackPokemon(uniqueId, { isFavorite: !currentFav });
  };

  const handleRename = (uniqueId, currentName) => {
    const newName = prompt('Ingresa el nuevo apodo para este Pokémon:', currentName);
    if (newName && newName.trim()) {
      updateBackpackPokemon(uniqueId, { nickname: newName.trim() });
    }
  };

  const handleRelease = (uniqueId, name) => {
    if (confirm(`¿Estás seguro de liberar a "${name}" de tu mochila? Volverá a su hábitat natural.`)) {
      removeFromBackpack(uniqueId);
    }
  };

  // Filtrado de la caja
  const filteredBox = box.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(boxSearch.toLowerCase()) ||
      p.nickname?.toLowerCase().includes(boxSearch.toLowerCase());
    const matchesType =
      selectedType === 'all' || p.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  // Estadísticas del equipo
  const teamAverageLevel = team.length
    ? Math.round(team.reduce((acc, p) => acc + (p.level || 5), 0) / team.length)
    : 0;

  return (
    <div className="backpack-container">
      {/* Encabezado de la Mochila */}
      <div className="backpack-hero">
        <div className="backpack-hero-content">
          <div className="trainer-hero-avatar">
            <img src={activeTrainer.avatar} alt={activeTrainer.name} />
          </div>
          <div>
            <div className="hero-tag-row">
              <span className="hero-tag">{activeTrainer.region}</span>
              <span className="hero-tag rank">{activeTrainer.rank}</span>
            </div>
            <h2 className="backpack-title">Mochila de {activeTrainer.name}</h2>
            <p className="backpack-subtitle">
              Gestiona tu equipo activo de batalla (máximo 6) y tu almacén de Pokémon capturados.
            </p>
          </div>
        </div>

        <div className="backpack-stats-cards">
          <div className="b-stat-card">
            <span className="b-stat-num">{team.length}/6</span>
            <span className="b-stat-lbl">Equipo Activo</span>
          </div>
          <div className="b-stat-card">
            <span className="b-stat-num">{box.length}</span>
            <span className="b-stat-lbl">En Caja PC</span>
          </div>
          <div className="b-stat-card">
            <span className="b-stat-num">{teamAverageLevel}</span>
            <span className="b-stat-lbl">Nivel Medio</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: EQUIPO ACTIVO (6 SLOTS) */}
      <section className="team-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-title">Equipo de Batalla</h3>
            <span className="section-subtitle">
              Los 6 Pokémon que te acompañan en combate
            </span>
          </div>
          {team.length < 6 && (
            <button className="btn btn-outline-sm" onClick={onGoToPokedex}>
              <Plus size={16} />
              <span>Buscar Pokémon para el equipo</span>
            </button>
          )}
        </div>

        <div className="team-grid">
          {Array.from({ length: 6 }).map((_, index) => {
            const pokemon = team[index];

            if (!pokemon) {
              return (
                <div
                  key={`empty-${index}`}
                  className="team-slot empty"
                  onClick={onGoToPokedex}
                  role="button"
                  tabIndex={0}
                >
                  <div className="empty-slot-icon">
                    <Plus size={28} />
                  </div>
                  <span className="empty-slot-text">Slot {index + 1} Vacío</span>
                  <span className="empty-slot-hint">Capturar en la Pokédex</span>
                </div>
              );
            }

            const primaryType = pokemon.types[0] || 'normal';
            const typeStyle = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

            return (
              <div
                key={pokemon.uniqueId}
                className="team-slot filled"
                style={{
                  '--slot-accent': typeStyle.color,
                  '--slot-bg': typeStyle.bg
                }}
              >
                <div className="slot-top">
                  <span className="slot-level">Nv. {pokemon.level}</span>
                  <div className="slot-actions">
                    <button
                      className={`slot-icon-btn ${pokemon.isFavorite ? 'fav' : ''}`}
                      onClick={() => handleToggleFavorite(pokemon.uniqueId, pokemon.isFavorite)}
                      title="Marcar como favorito"
                    >
                      <Star size={16} fill={pokemon.isFavorite ? '#fac000' : 'none'} />
                    </button>
                    {pokemon.cryAudio && (
                      <button
                        className="slot-icon-btn"
                        onClick={() => handlePlayCry(pokemon.cryAudio)}
                        title="Sonido"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="slot-image-wrap">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="slot-image"
                  />
                  {pokemon.isShiny && (
                    <span className="shiny-star-badge" title="Variocolor">
                      <Sparkles size={14} />
                    </span>
                  )}
                </div>

                <div className="slot-info">
                  <h4
                    className="slot-nickname"
                    onClick={() => handleRename(pokemon.uniqueId, pokemon.nickname)}
                    title="Click para cambiar apodo"
                  >
                    {pokemon.nickname}
                  </h4>
                  {pokemon.nickname !== pokemon.name && (
                    <span className="slot-orig-name">({pokemon.name})</span>
                  )}

                  <div className="slot-types">
                    {pokemon.types.map(t => {
                      const tInfo = POKEMON_TYPES[t] || { name: t, color: '#666' };
                      return (
                        <span
                          key={t}
                          className="type-tag mini"
                          style={{ backgroundColor: tInfo.color }}
                        >
                          {tInfo.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="slot-footer-btns">
                  <button
                    className="slot-move-btn"
                    onClick={() => moveToBox(pokemon.uniqueId)}
                    title="Mover a la caja de almacenamiento"
                  >
                    <ArrowDownToLine size={14} />
                    <span>A Caja</span>
                  </button>
                  <button
                    className="slot-release-btn"
                    onClick={() => handleRelease(pokemon.uniqueId, pokemon.nickname)}
                    title="Liberar Pokémon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 2: CAJA DE ALMACENAMIENTO (PC BOX) */}
      <section className="box-section">
        <div className="section-title-row">
          <div>
            <h3 className="section-title">Caja de Almacenamiento PC</h3>
            <span className="section-subtitle">
              Todos los Pokémon capturados que no están en el equipo actual ({box.length})
            </span>
          </div>

          <div className="box-filters-row">
            <div className="box-search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar por apodo o nombre..."
                value={boxSearch}
                onChange={e => setBoxSearch(e.target.value)}
                className="box-search-input"
              />
            </div>

            <select
              className="box-type-select"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(POKEMON_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {box.length === 0 ? (
          <div className="box-empty-card">
            <Inbox size={48} className="empty-box-icon" />
            <h4>Tu caja de almacenamiento está vacía</h4>
            <p>
              Cuando captures más de 6 Pokémon, o decidas guardar miembros de tu equipo, aparecerán aquí.
            </p>
            <button className="btn btn-primary" onClick={onGoToPokedex}>
              Explorar la Pokédex
            </button>
          </div>
        ) : filteredBox.length === 0 ? (
          <div className="box-empty-card">
            <p>No se encontraron Pokémon con esos filtros en tu caja.</p>
          </div>
        ) : (
          <div className="box-grid">
            {filteredBox.map(poke => {
              const primaryType = poke.types[0] || 'normal';
              const typeStyle = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

              return (
                <div
                  key={poke.uniqueId}
                  className="box-poke-card"
                  style={{ '--card-accent': typeStyle.color }}
                >
                  <div className="box-card-top">
                    <span className="box-poke-lvl">Nv. {poke.level}</span>
                    <button
                      className={`slot-icon-btn ${poke.isFavorite ? 'fav' : ''}`}
                      onClick={() => handleToggleFavorite(poke.uniqueId, poke.isFavorite)}
                    >
                      <Star size={14} fill={poke.isFavorite ? '#fac000' : 'none'} />
                    </button>
                  </div>

                  <img
                    src={poke.image}
                    alt={poke.name}
                    className="box-poke-img"
                  />

                  <h5 className="box-poke-name">{poke.nickname}</h5>
                  <div className="box-poke-types">
                    {poke.types.map(t => (
                      <span
                        key={t}
                        className="type-tag micro"
                        style={{ backgroundColor: POKEMON_TYPES[t]?.color || '#777' }}
                      >
                        {POKEMON_TYPES[t]?.name || t}
                      </span>
                    ))}
                  </div>

                  <div className="box-card-actions">
                    <button
                      className="btn-box-action team-btn"
                      onClick={() => moveToTeam(poke.uniqueId)}
                      disabled={team.length >= 6}
                      title={team.length >= 6 ? 'Equipo lleno (6/6)' : 'Añadir al equipo'}
                    >
                      <ArrowUpFromLine size={14} />
                      <span>Al Equipo</span>
                    </button>

                    <button
                      className="btn-box-action release-btn"
                      onClick={() => handleRelease(poke.uniqueId, poke.nickname)}
                      title="Liberar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
