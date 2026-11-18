import React, { useState } from 'react';
import { TrainerProvider } from './context/TrainerContext';
import Navbar from './components/Navbar';
import PokedexView from './components/PokedexView';
import BackpackView from './components/BackpackView';
import TrainersView from './components/TrainersView';
import PokemonDetailModal from './components/PokemonDetailModal';
import CatchModal from './components/CatchModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState('pokedex');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [catchModalData, setCatchModalData] = useState(null);

  const handleOpenCatch = (pokemon, options = {}) => {
    setCatchModalData({
      pokemon,
      initialShiny: options.isShiny || false
    });
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {activeTab === 'pokedex' && (
          <PokedexView
            onSelectPokemon={poke => setSelectedPokemon(poke)}
            onQuickCatch={poke => handleOpenCatch(poke)}
          />
        )}

        {activeTab === 'backpack' && (
          <BackpackView
            onGoToPokedex={() => setActiveTab('pokedex')}
          />
        )}

        {activeTab === 'trainers' && (
          <TrainersView />
        )}
      </main>

      {/* Modal de Detalle de Pokémon */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onCatch={(poke, options) => {
            setSelectedPokemon(null);
            handleOpenCatch(poke, options);
          }}
        />
      )}

      {/* Modal de Captura a la Mochila */}
      {catchModalData && (
        <CatchModal
          pokemon={catchModalData.pokemon}
          initialShiny={catchModalData.initialShiny}
          onClose={() => setCatchModalData(null)}
        />
      )}

      {/* Pie de página */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Pokédex Master Trainer &copy; 2026 • Desarrollado con <strong>React</strong> + <strong>Vite</strong>
          </p>
          <p className="footer-sub">
            Datos obtenidos en tiempo real de la <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TrainerProvider>
      <MainApp />
    </TrainerProvider>
  );
}
