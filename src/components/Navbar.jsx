import React from 'react';
import { BookOpen, Backpack, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useTrainer } from '../context/TrainerContext';

export default function Navbar({ activeTab, setActiveTab, onOpenTrainerModal }) {
  const { activeTrainer, totalCaptured } = useTrainer();
  const teamCount = activeTrainer?.backpack?.team?.length || 0;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo de la Pokedex */}
        <div className="brand" onClick={() => setActiveTab('pokedex')} role="button" tabIndex={0}>
          <div className="pokeball-icon-wrapper">
            <div className="pokeball-icon">
              <div className="pokeball-button"></div>
            </div>
          </div>
          <div>
            <h1 className="brand-title">POKÉDEX</h1>
            <span className="brand-subtitle">Master Trainer Edition</span>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'pokedex' ? 'active' : ''}`}
            onClick={() => setActiveTab('pokedex')}
          >
            <BookOpen size={18} />
            <span>Pokédex</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'backpack' ? 'active' : ''}`}
            onClick={() => setActiveTab('backpack')}
          >
            <Backpack size={18} />
            <span>Mochila</span>
            {totalCaptured > 0 && (
              <span className="badge-counter">{totalCaptured}</span>
            )}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            <Users size={18} />
            <span>Entrenadores</span>
          </button>
        </nav>

        {/* Entrenador Activo Widget */}
        <div
          className="active-trainer-widget"
          onClick={() => setActiveTab('trainers')}
          title="Ver o cambiar perfil de entrenador"
        >
          <div className="trainer-avatar-mini">
            <img src={activeTrainer.avatar} alt={activeTrainer.name} />
          </div>
          <div className="trainer-info-mini">
            <div className="trainer-name-row">
              <span className="trainer-name">{activeTrainer.name}</span>
              <span className="trainer-region-badge">{activeTrainer.region}</span>
            </div>
            <div className="trainer-meta-row">
              <span>Equipo: {teamCount}/6</span>
              <span>•</span>
              <span>Total: {totalCaptured}</span>
            </div>
          </div>
          <ChevronRight size={16} className="chevron-icon" />
        </div>
      </div>
    </header>
  );
}
