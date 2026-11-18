import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRAINER_AVATARS, TRAINER_RANKS } from '../utils/pokemonConstants';

const STORAGE_KEY = 'pokemon_trainer_profiles_v1';
const ACTIVE_TRAINER_KEY = 'pokemon_active_trainer_id_v1';

// Perfil de ejemplo inicial para que el usuario empiece de inmediato
const DEFAULT_INITIAL_TRAINER = {
  id: 'trainer-default-1',
  name: 'Ash Ketchum',
  avatar: TRAINER_AVATARS[0].sprite,
  avatarId: 'red',
  region: 'Kanto',
  rank: 'Entrenador Novato',
  createdAt: new Date().toISOString(),
  badges: ['Roca', 'Cascada'],
  backpack: {
    team: [
      {
        uniqueId: 'poke-pika-init',
        id: 25,
        name: 'Pikachu',
        nickname: 'Pika',
        level: 15,
        types: ['electric'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        animatedSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif',
        stats: [
          { name: 'hp', base: 35 },
          { name: 'attack', base: 55 },
          { name: 'defense', base: 40 },
          { name: 'special-attack', base: 50 },
          { name: 'special-defense', base: 50 },
          { name: 'speed', base: 90 }
        ],
        cryAudio: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg',
        caughtAt: new Date().toISOString(),
        isFavorite: true,
        isShiny: false
      }
    ],
    box: []
  }
};

const TrainerContext = createContext();

export function TrainerProvider({ children }) {
  const [trainers, setTrainers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading trainers from localStorage', e);
    }
    return [DEFAULT_INITIAL_TRAINER];
  });

  const [activeTrainerId, setActiveTrainerId] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_TRAINER_KEY);
      if (savedId) return savedId;
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_INITIAL_TRAINER.id;
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers));
    } catch (e) {
      console.error('Error saving trainers to localStorage', e);
    }
  }, [trainers]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TRAINER_KEY, activeTrainerId);
    } catch (e) {
      console.error('Error saving active trainer id', e);
    }
  }, [activeTrainerId]);

  // Entrenador actualmente activo
  const activeTrainer = trainers.find(t => t.id === activeTrainerId) || trainers[0] || DEFAULT_INITIAL_TRAINER;

  // Crear nuevo entrenador
  const createTrainer = ({ name, avatarId, region }) => {
    const avatarObj = TRAINER_AVATARS.find(a => a.id === avatarId) || TRAINER_AVATARS[0];
    const newTrainer = {
      id: `trainer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim() || 'Entrenador Pokémon',
      avatar: avatarObj.sprite,
      avatarId: avatarObj.id,
      region: region || 'Kanto',
      rank: 'Entrenador Novato',
      createdAt: new Date().toISOString(),
      badges: [],
      backpack: {
        team: [],
        box: []
      }
    };

    setTrainers(prev => [...prev, newTrainer]);
    setActiveTrainerId(newTrainer.id);
    return newTrainer;
  };

  // Modificar entrenador existente
  const updateTrainer = (id, updates) => {
    setTrainers(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        let newAvatar = t.avatar;
        if (updates.avatarId) {
          const found = TRAINER_AVATARS.find(a => a.id === updates.avatarId);
          if (found) newAvatar = found.sprite;
        }
        return { ...t, ...updates, avatar: newAvatar };
      })
    );
  };

  // Eliminar perfil de entrenador
  const deleteTrainer = (id) => {
    if (trainers.length <= 1) {
      alert('Debes mantener al menos un perfil de entrenador activo.');
      return false;
    }
    const filtered = trainers.filter(t => t.id !== id);
    setTrainers(filtered);
    if (activeTrainerId === id) {
      setActiveTrainerId(filtered[0].id);
    }
    return true;
  };

  // Añadir Pokémon a la mochila
  const addToBackpack = (pokemon, options = {}) => {
    if (!activeTrainer) return false;

    const uniqueId = `poke-${pokemon.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const isShiny = !!options.isShiny;

    const backpackItem = {
      uniqueId,
      id: pokemon.id,
      name: pokemon.name,
      nickname: options.nickname ? options.nickname.trim() : pokemon.name,
      level: options.level || Math.floor(Math.random() * 25) + 5,
      types: pokemon.types,
      image: isShiny ? (pokemon.shinyImage || pokemon.image) : pokemon.image,
      animatedSprite: isShiny ? (pokemon.animatedShiny || pokemon.animatedSprite) : pokemon.animatedSprite,
      stats: pokemon.stats,
      totalStats: pokemon.totalStats,
      cryAudio: pokemon.cryAudio,
      height: pokemon.height,
      weight: pokemon.weight,
      isShiny,
      isFavorite: false,
      caughtAt: new Date().toISOString()
    };

    setTrainers(prev =>
      prev.map(trainer => {
        if (trainer.id !== activeTrainer.id) return trainer;

        const currentTeam = trainer.backpack?.team || [];
        const currentBox = trainer.backpack?.box || [];

        // Si el equipo de batalla tiene menos de 6, entra al equipo activo; si no, a la caja de almacenamiento
        if (currentTeam.length < 6) {
          return {
            ...trainer,
            backpack: {
              ...trainer.backpack,
              team: [...currentTeam, backpackItem]
            }
          };
        } else {
          return {
            ...trainer,
            backpack: {
              ...trainer.backpack,
              box: [...currentBox, backpackItem]
            }
          };
        }
      })
    );

    return true;
  };

  // Liberar / Eliminar Pokémon de la mochila
  const removeFromBackpack = (uniqueId) => {
    setTrainers(prev =>
      prev.map(trainer => {
        if (trainer.id !== activeTrainer.id) return trainer;
        return {
          ...trainer,
          backpack: {
            team: (trainer.backpack?.team || []).filter(p => p.uniqueId !== uniqueId),
            box: (trainer.backpack?.box || []).filter(p => p.uniqueId !== uniqueId)
          }
        };
      })
    );
  };

  // Mover Pokémon de la caja al equipo activo
  const moveToTeam = (uniqueId) => {
    setTrainers(prev =>
      prev.map(trainer => {
        if (trainer.id !== activeTrainer.id) return trainer;
        const currentTeam = trainer.backpack?.team || [];
        const currentBox = trainer.backpack?.box || [];

        if (currentTeam.length >= 6) {
          alert('¡Tu equipo de batalla ya tiene el límite máximo de 6 Pokémon! Mueve uno a la caja primero.');
          return trainer;
        }

        const poke = currentBox.find(p => p.uniqueId === uniqueId);
        if (!poke) return trainer;

        return {
          ...trainer,
          backpack: {
            team: [...currentTeam, poke],
            box: currentBox.filter(p => p.uniqueId !== uniqueId)
          }
        };
      })
    );
  };

  // Mover Pokémon del equipo a la caja
  const moveToBox = (uniqueId) => {
    setTrainers(prev =>
      prev.map(trainer => {
        if (trainer.id !== activeTrainer.id) return trainer;
        const currentTeam = trainer.backpack?.team || [];
        const currentBox = trainer.backpack?.box || [];

        const poke = currentTeam.find(p => p.uniqueId === uniqueId);
        if (!poke) return trainer;

        return {
          ...trainer,
          backpack: {
            team: currentTeam.filter(p => p.uniqueId !== uniqueId),
            box: [...currentBox, poke]
          }
        };
      })
    );
  };

  // Actualizar apodo o favorito
  const updateBackpackPokemon = (uniqueId, changes) => {
    setTrainers(prev =>
      prev.map(trainer => {
        if (trainer.id !== activeTrainer.id) return trainer;
        const updateList = list =>
          (list || []).map(p => (p.uniqueId === uniqueId ? { ...p, ...changes } : p));

        return {
          ...trainer,
          backpack: {
            team: updateList(trainer.backpack?.team),
            box: updateList(trainer.backpack?.box)
          }
        };
      })
    );
  };

  // Comprobar si un Pokémon está capturado en la mochila del entrenador activo
  const isInBackpack = (pokemonId) => {
    if (!activeTrainer?.backpack) return false;
    const inTeam = (activeTrainer.backpack.team || []).some(p => p.id === pokemonId);
    const inBox = (activeTrainer.backpack.box || []).some(p => p.id === pokemonId);
    return inTeam || inBox;
  };

  const totalCaptured = (activeTrainer?.backpack?.team?.length || 0) + (activeTrainer?.backpack?.box?.length || 0);

  return (
    <TrainerContext.Provider
      value={{
        trainers,
        activeTrainer,
        activeTrainerId,
        setActiveTrainerId,
        createTrainer,
        updateTrainer,
        deleteTrainer,
        addToBackpack,
        removeFromBackpack,
        moveToTeam,
        moveToBox,
        updateBackpackPokemon,
        isInBackpack,
        totalCaptured
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainer() {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer debe ser usado dentro de un TrainerProvider');
  }
  return context;
}
