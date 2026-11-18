import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit2, User, Sparkles, Award } from 'lucide-react';
import { useTrainer } from '../context/TrainerContext';
import { TRAINER_AVATARS, REGIONS } from '../utils/pokemonConstants';

export default function TrainersView() {
  const {
    trainers,
    activeTrainerId,
    setActiveTrainerId,
    createTrainer,
    updateTrainer,
    deleteTrainer
  } = useTrainer();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  // Formulario nuevo entrenador
  const [formName, setFormName] = useState('');
  const [formAvatarId, setFormAvatarId] = useState('red');
  const [formRegion, setFormRegion] = useState('Kanto');

  const handleOpenCreate = () => {
    setFormName('');
    setFormAvatarId('red');
    setFormRegion('Kanto');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Por favor ingresa un nombre para el entrenador.');
      return;
    }
    createTrainer({
      name: formName,
      avatarId: formAvatarId,
      region: formRegion
    });
    setShowCreateModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTrainer || !editingTrainer.name.trim()) return;

    updateTrainer(editingTrainer.id, {
      name: editingTrainer.name,
      avatarId: editingTrainer.avatarId,
      region: editingTrainer.region
    });
    setEditingTrainer(null);
  };

  return (
    <div className="trainers-container">
      {/* Encabezado */}
      <div className="trainers-hero">
        <div>
          <h2 className="trainers-hero-title">Perfiles de Entrenadores Pokémon</h2>
          <p className="trainers-hero-subtitle">
            Crea múltiples perfiles. Cada entrenador posee su propia mochila, equipo de combate y almacenamiento independiente.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Crear Nuevo Entrenador</span>
        </button>
      </div>

      {/* Grid de Perfiles */}
      <div className="trainers-grid">
        {trainers.map(trainer => {
          const isActive = trainer.id === activeTrainerId;
          const teamCount = trainer.backpack?.team?.length || 0;
          const boxCount = trainer.backpack?.box?.length || 0;
          const totalPokemon = teamCount + boxCount;

          return (
            <div
              key={trainer.id}
              className={`trainer-profile-card ${isActive ? 'active-profile' : ''}`}
            >
              {isActive && (
                <div className="active-profile-pill">
                  <Check size={14} />
                  <span>Entrenador Activo</span>
                </div>
              )}

              <div className="profile-card-header">
                <div className="profile-avatar-circle">
                  <img src={trainer.avatar} alt={trainer.name} />
                </div>
                <div className="profile-identity">
                  <h3 className="profile-name">{trainer.name}</h3>
                  <span className="profile-region-tag">Región de {trainer.region}</span>
                  <span className="profile-rank">{trainer.rank || 'Entrenador Novato'}</span>
                </div>
              </div>

              {/* Mini previsualización del equipo del entrenador */}
              <div className="profile-team-preview">
                <span className="preview-label">Equipo Activo ({teamCount}/6):</span>
                <div className="preview-sprites-row">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const poke = trainer.backpack?.team?.[i];
                    return (
                      <div key={i} className="mini-poke-slot">
                        {poke ? (
                          <img
                            src={poke.image}
                            alt={poke.name}
                            title={`${poke.nickname} (Nv. ${poke.level})`}
                          />
                        ) : (
                          <span className="empty-dot"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estadísticas del Entrenador */}
              <div className="profile-stats-grid">
                <div className="p-stat">
                  <span className="p-stat-val">{totalPokemon}</span>
                  <span className="p-stat-lbl">Capturados</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-val">{teamCount}</span>
                  <span className="p-stat-lbl">En Equipo</span>
                </div>
                <div className="p-stat">
                  <span className="p-stat-val">{boxCount}</span>
                  <span className="p-stat-lbl">En Caja PC</span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="profile-actions">
                {!isActive ? (
                  <button
                    className="btn btn-primary flex-1"
                    onClick={() => setActiveTrainerId(trainer.id)}
                  >
                    <span>Seleccionar Perfil</span>
                  </button>
                ) : (
                  <button className="btn btn-outline flex-1" disabled>
                    <Check size={16} />
                    <span>Seleccionado</span>
                  </button>
                )}

                <button
                  className="btn-icon-subtle"
                  onClick={() => setEditingTrainer({ ...trainer })}
                  title="Editar perfil"
                >
                  <Edit2 size={16} />
                </button>

                {trainers.length > 1 && (
                  <button
                    className="btn-icon-subtle danger"
                    onClick={() => {
                      if (confirm(`¿Eliminar definitivamente el perfil de "${trainer.name}" y toda su mochila?`)) {
                        deleteTrainer(trainer.id);
                      }
                    }}
                    title="Eliminar perfil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CREAR ENTRENADOR */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content trainer-form-modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-form-title">Crear Nuevo Entrenador</h3>
            <p className="modal-form-subtitle">Configura tu identidad y tu avatar de aventura Pokémon.</p>

            <form onSubmit={handleCreateSubmit} className="trainer-form">
              <div className="form-group">
                <label>Nombre del Entrenador</label>
                <input
                  type="text"
                  placeholder="Ej: Red, Maya, Gold, Gary..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Región de Origen</label>
                <select
                  value={formRegion}
                  onChange={e => setFormRegion(e.target.value)}
                  className="form-select"
                >
                  {REGIONS.map(r => (
                    <option key={r.id} value={r.name}>
                      {r.name} (Gen {r.gen})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Selecciona tu Sprite / Avatar</label>
                <div className="avatar-selection-grid">
                  {TRAINER_AVATARS.map(av => (
                    <div
                      key={av.id}
                      className={`avatar-option ${formAvatarId === av.id ? 'selected' : ''}`}
                      onClick={() => setFormAvatarId(av.id)}
                    >
                      <img src={av.sprite} alt={av.name} />
                      <span>{av.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Entrenador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR ENTRENADOR */}
      {editingTrainer && (
        <div className="modal-backdrop" onClick={() => setEditingTrainer(null)}>
          <div className="modal-content trainer-form-modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-form-title">Editar Entrenador</h3>

            <form onSubmit={handleEditSubmit} className="trainer-form">
              <div className="form-group">
                <label>Nombre del Entrenador</label>
                <input
                  type="text"
                  value={editingTrainer.name}
                  onChange={e => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Región de Origen</label>
                <select
                  value={editingTrainer.region}
                  onChange={e => setEditingTrainer({ ...editingTrainer, region: e.target.value })}
                  className="form-select"
                >
                  {REGIONS.map(r => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Avatar</label>
                <div className="avatar-selection-grid">
                  {TRAINER_AVATARS.map(av => (
                    <div
                      key={av.id}
                      className={`avatar-option ${editingTrainer.avatarId === av.id ? 'selected' : ''}`}
                      onClick={() => setEditingTrainer({ ...editingTrainer, avatarId: av.id })}
                    >
                      <img src={av.sprite} alt={av.name} />
                      <span>{av.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingTrainer(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
