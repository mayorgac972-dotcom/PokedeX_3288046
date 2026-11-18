import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Shuffle,
  Filter,
  Loader2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { getPokemon, getPokemonList, getPokemonByType } from '../services/pokeApi';
import { POKEMON_TYPES, REGIONS } from '../utils/pokemonConstants';
import PokemonCard from './PokemonCard';

export default function PokedexView({ onSelectPokemon, onQuickCatch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchedSinglePokemon, setSearchedSinglePokemon] = useState(null);

  const PAGE_LIMIT = 24;

  // Cargar lista inicial de Pokémon
  const loadInitialPokemon = async () => {
    setLoading(true);
    setError(null);
    setSearchedSinglePokemon(null);
    try {
      const data = await getPokemonList(0, PAGE_LIMIT);
      setPokemonList(data.results);
      setOffset(PAGE_LIMIT);
      setHasMore(data.results.length < data.count);
    } catch (err) {
      setError('Error al conectar con la PokeAPI. Por favor verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialPokemon();
  }, []);

  // Manejar búsqueda directa por nombre o número (consume https://pokeapi.co/api/v2/pokemon/{query})
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      handleResetFilters();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const pokemon = await getPokemon(query);
      setSearchedSinglePokemon(pokemon);
      setPokemonList([]);
    } catch (err) {
      setSearchedSinglePokemon(null);
      setError(`No pudimos encontrar al Pokémon "${query}". Revisa que el nombre o número sea correcto.`);
    } finally {
      setLoading(false);
    }
  };

  // Buscar un Pokémon aleatorio ("¡Sorpréndeme!")
  const handleRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setSearchQuery(String(randomId));
    setLoading(true);
    setError(null);
    try {
      const pokemon = await getPokemon(randomId);
      setSearchedSinglePokemon(pokemon);
      setPokemonList([]);
    } catch (err) {
      setError('Error al obtener Pokémon aleatorio.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por tipo
  const handleTypeSelect = async (type) => {
    setSelectedType(type);
    setSelectedRegion('all');
    setSearchQuery('');
    setSearchedSinglePokemon(null);

    if (type === 'all') {
      loadInitialPokemon();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const list = await getPokemonByType(type);
      setPokemonList(list);
      setHasMore(false);
    } catch (err) {
      setError(`Error al filtrar Pokémon del tipo ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por Región / Generación
  const handleRegionSelect = async (regionId) => {
    setSelectedRegion(regionId);
    setSelectedType('all');
    setSearchQuery('');
    setSearchedSinglePokemon(null);

    if (regionId === 'all') {
      loadInitialPokemon();
      return;
    }

    const reg = REGIONS.find(r => r.id === regionId);
    if (!reg) return;

    const [startId, endId] = reg.range;
    const count = endId - startId + 1;
    const regionOffset = startId - 1;

    setLoading(true);
    setError(null);
    try {
      const data = await getPokemonList(regionOffset, Math.min(count, 36));
      setPokemonList(data.results);
      setHasMore(false);
    } catch (err) {
      setError(`Error al cargar la región ${reg.name}.`);
    } finally {
      setLoading(false);
    }
  };

  // Cargar más Pokémon (paginación infinita / load more)
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getPokemonList(offset, PAGE_LIMIT);
      setPokemonList(prev => [...prev, ...data.results]);
      setOffset(prev => prev + PAGE_LIMIT);
      setHasMore(data.results.length === PAGE_LIMIT);
    } catch (err) {
      setError('Error al cargar más Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  // Restablecer filtros
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedRegion('all');
    loadInitialPokemon();
  };

  return (
    <div className="pokedex-view-container">
      {/* Banner Principal de Búsqueda */}
      <section className="search-hero-section">
        <div className="search-hero-content">
          <h2 className="search-hero-title">
            Encuentra y Registra a tus Pokémon Favoritos
          </h2>
          <p className="search-hero-desc">
            Busca por nombre (ej: <em>Pikachu, Charizard</em>) o número Pokédex (ej: <em>25, 150</em>), y guárdalos en tu mochila de entrenador.
          </p>

          <form onSubmit={handleSearch} className="search-form-bar">
            <div className="search-input-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre o número (ej: Pikachu o 25)..."
                className="main-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <button type="submit" className="btn btn-search">
              Buscar
            </button>

            <button
              type="button"
              className="btn btn-surprise"
              onClick={handleRandomPokemon}
              title="Descubrir un Pokémon al azar"
            >
              <Shuffle size={18} />
              <span className="btn-text-desktop">¡Al azar!</span>
            </button>
          </form>

          {/* Atajos de búsqueda populares */}
          <div className="quick-tags-row">
            <span className="quick-tags-label">Populares:</span>
            {['Pikachu', 'Charizard', 'Gengar', 'Mewtwo', 'Lucario', 'Eevee', 'Gengar'].map(pokeName => (
              <button
                key={pokeName}
                type="button"
                className="quick-search-chip"
                onClick={() => {
                  setSearchQuery(pokeName);
                  getPokemon(pokeName).then(poke => {
                    setSearchedSinglePokemon(poke);
                    setPokemonList([]);
                  }).catch(() => {});
                }}
              >
                {pokeName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Barra de Filtros por Tipo y Región */}
      <section className="filters-section">
        {/* Filtros por Región */}
        <div className="region-filters-scroll">
          <button
            className={`region-chip ${selectedRegion === 'all' ? 'active' : ''}`}
            onClick={() => handleRegionSelect('all')}
          >
            Todas las Regiones
          </button>
          {REGIONS.map(reg => (
            <button
              key={reg.id}
              className={`region-chip ${selectedRegion === reg.id ? 'active' : ''}`}
              onClick={() => handleRegionSelect(reg.id)}
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Filtros por Tipo elemental */}
        <div className="type-filters-scroll">
          <button
            className={`type-filter-chip ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => handleTypeSelect('all')}
            style={{
              borderColor: selectedType === 'all' ? '#ef4444' : 'transparent'
            }}
          >
            Todos los Tipos
          </button>
          {Object.entries(POKEMON_TYPES).map(([typeKey, typeData]) => {
            const isSelected = selectedType === typeKey;
            return (
              <button
                key={typeKey}
                className={`type-filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleTypeSelect(typeKey)}
                style={{
                  backgroundColor: isSelected ? typeData.color : 'transparent',
                  color: isSelected ? '#ffffff' : typeData.color,
                  borderColor: typeData.color
                }}
              >
                {typeData.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mensajes de Error */}
      {error && (
        <div className="alert-box error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="btn btn-sm btn-outline" onClick={handleResetFilters}>
            <RotateCcw size={14} />
            <span>Restablecer</span>
          </button>
        </div>
      )}

      {/* RESULTADO: Pokémon individual buscado */}
      {searchedSinglePokemon && (
        <div className="searched-result-section">
          <div className="search-result-banner">
            <h3>Resultado de búsqueda para "{searchQuery || searchedSinglePokemon.name}"</h3>
            <button className="btn btn-outline-sm" onClick={handleResetFilters}>
              Volver al listado completo
            </button>
          </div>

          <div className="single-pokemon-showcase-grid">
            <PokemonCard
              pokemon={searchedSinglePokemon}
              onSelect={onSelectPokemon}
              onQuickCatch={onQuickCatch}
            />
          </div>
        </div>
      )}

      {/* GRID DE POKÉMON */}
      {!searchedSinglePokemon && pokemonList.length > 0 && (
        <div className="pokemon-grid-container">
          <div className="pokemon-grid">
            {pokemonList.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onSelect={onSelectPokemon}
                onQuickCatch={onQuickCatch}
              />
            ))}
          </div>

          {/* Botón Cargar Más */}
          {hasMore && selectedType === 'all' && selectedRegion === 'all' && (
            <div className="load-more-container">
              <button
                className="btn btn-load-more"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Cargando más Pokémon...</span>
                  </>
                ) : (
                  <span>Cargar más Pokémon ({offset} cargados)</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Indicador de carga inicial */}
      {loading && pokemonList.length === 0 && !searchedSinglePokemon && (
        <div className="loading-state-box">
          <div className="pokeball-loading-spinner"></div>
          <p>Conectando con la Pokédex oficial...</p>
        </div>
      )}
    </div>
  );
}
