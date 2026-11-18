// Traducciones y estilos de tipos Pokémon
export const POKEMON_TYPES = {
  normal: { name: 'Normal', color: '#9fa19f', bg: 'rgba(159, 161, 159, 0.2)', border: '#797979' },
  fire: { name: 'Fuego', color: '#e62829', bg: 'rgba(230, 40, 41, 0.2)', border: '#c01e1f' },
  water: { name: 'Agua', color: '#2980ef', bg: 'rgba(41, 128, 239, 0.2)', border: '#1c62bf' },
  grass: { name: 'Planta', color: '#3fa129', bg: 'rgba(63, 161, 41, 0.2)', border: '#2f7a1e' },
  electric: { name: 'Eléctrico', color: '#fac000', bg: 'rgba(250, 192, 0, 0.2)', border: '#c79900' },
  ice: { name: 'Hielo', color: '#3dcef3', bg: 'rgba(61, 206, 243, 0.2)', border: '#22a0c0' },
  fighting: { name: 'Lucha', color: '#ff8000', bg: 'rgba(255, 128, 0, 0.2)', border: '#c96500' },
  poison: { name: 'Veneno', color: '#9141cb', bg: 'rgba(145, 65, 203, 0.2)', border: '#6c2e99' },
  ground: { name: 'Tierra', color: '#915121', bg: 'rgba(145, 81, 33, 0.2)', border: '#6b3c18' },
  flying: { name: 'Volador', color: '#81b9ef', bg: 'rgba(129, 185, 239, 0.2)', border: '#5b8ebb' },
  psychic: { name: 'Psíquico', color: '#ef4179', bg: 'rgba(239, 65, 121, 0.2)', border: '#bf2a5a' },
  bug: { name: 'Bicho', color: '#91a119', bg: 'rgba(145, 161, 25, 0.2)', border: '#6e7b12' },
  rock: { name: 'Roca', color: '#afa981', bg: 'rgba(175, 169, 129, 0.2)', border: '#847f5e' },
  ghost: { name: 'Fantasma', color: '#704170', bg: 'rgba(112, 65, 112, 0.2)', border: '#4e2d4e' },
  dragon: { name: 'Dragón', color: '#5060e1', bg: 'rgba(80, 96, 225, 0.2)', border: '#3543b5' },
  steel: { name: 'Acero', color: '#60a1b8', bg: 'rgba(96, 161, 184, 0.2)', border: '#467788' },
  fairy: { name: 'Hada', color: '#ef70ef', bg: 'rgba(239, 112, 239, 0.2)', border: '#ba4fba' },
  dark: { name: 'Siniestro', color: '#50413f', bg: 'rgba(80, 65, 63, 0.2)', border: '#382c2a' }
};

// Traducciones de estadísticas
export const STAT_NAMES = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad'
};

// Avatares disponibles para entrenadores
export const TRAINER_AVATARS = [
  { id: 'red', name: 'Rojo (Red)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png' },
  { id: 'leaf', name: 'Hoja (Leaf)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/leaf.png' },
  { id: 'ethan', name: 'Eco (Ethan)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ethan.png' },
  { id: 'lyra', name: 'Lira (Lyra)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lyra.png' },
  { id: 'brendan', name: 'Bruno (Brendan)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brendan.png' },
  { id: 'may', name: 'Aura (May)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/may.png' },
  { id: 'lucas', name: 'León (Lucas)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lucas.png' },
  { id: 'dawn', name: 'Maya (Dawn)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/dawn.png' },
  { id: 'cynthia', name: 'Cintia (Cynthia)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/cynthia.png' },
  { id: 'steven', name: 'Máximo (Steven)', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/steven.png' }
];

// Regiones del mundo Pokémon
export const REGIONS = [
  { id: 'kanto', name: 'Kanto', gen: 1, range: [1, 151] },
  { id: 'johto', name: 'Johto', gen: 2, range: [152, 251] },
  { id: 'hoenn', name: 'Hoenn', gen: 3, range: [252, 386] },
  { id: 'sinnoh', name: 'Sinnoh', gen: 4, range: [387, 493] },
  { id: 'unova', name: 'Teselia (Unova)', gen: 5, range: [494, 649] },
  { id: 'kalos', name: 'Kalos', gen: 6, range: [650, 721] },
  { id: 'alola', name: 'Alola', gen: 7, range: [722, 809] },
  { id: 'galar', name: 'Galar', gen: 8, range: [810, 905] },
  { id: 'paldea', name: 'Paldea', gen: 9, range: [906, 1025] }
];

export const TRAINER_RANKS = [
  'Entrenador Novato',
  'Entrenador Promesa',
  'Líder de Gimnasio',
  'Alto Mando',
  'Campeón de la Liga',
  'Maestro Pokémon'
];
