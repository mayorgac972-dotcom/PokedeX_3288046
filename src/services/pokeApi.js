const BASE_URL = 'https://pokeapi.co/api/v2';

// Formatear datos de Pokémon para uso uniforme en la app
export function formatPokemonData(raw) {
  if (!raw) return null;

  const id = raw.id;
  const formattedId = `#${String(id).padStart(4, '0')}`;
  const name = raw.name.charAt(0).toUpperCase() + raw.name.slice(1);

  // Imágenes en orden de preferencia de calidad
  const officialArtwork = raw.sprites?.other?.['official-artwork']?.front_default;
  const officialShiny = raw.sprites?.other?.['official-artwork']?.front_shiny;
  const animatedSprite = raw.sprites?.other?.showdown?.front_default || raw.sprites?.front_default;
  const animatedShiny = raw.sprites?.other?.showdown?.front_shiny || raw.sprites?.front_shiny;

  const image = officialArtwork || raw.sprites?.front_default || '';
  const shinyImage = officialShiny || raw.sprites?.front_shiny || image;

  const types = raw.types?.map(t => t.type.name) || [];

  const stats = raw.stats?.map(s => ({
    name: s.stat.name,
    base: s.base_stat
  })) || [];

  const totalStats = stats.reduce((acc, curr) => acc + curr.base, 0);

  const abilities = raw.abilities?.map(a => ({
    name: a.ability.name.replace('-', ' '),
    isHidden: a.is_hidden
  })) || [];

  // Audio oficial del Pokémon (cries)
  const cryAudio = raw.cries?.latest || raw.cries?.legacy || null;

  return {
    id,
    formattedId,
    name,
    rawName: raw.name,
    height: (raw.height / 10).toFixed(1), // Metros
    weight: (raw.weight / 10).toFixed(1), // Kilogramos
    image,
    shinyImage,
    animatedSprite,
    animatedShiny,
    types,
    stats,
    totalStats,
    abilities,
    cryAudio,
    baseExperience: raw.base_experience
  };
}

// Buscar Pokémon por nombre o por ID
export async function getPokemon(nameOrId) {
  if (!nameOrId) throw new Error('Debes indicar un nombre o número de Pokémon');
  const query = String(nameOrId).toLowerCase().trim();
  const response = await fetch(`${BASE_URL}/pokemon/${query}`);
  if (!response.ok) {
    throw new Error(`Pokémon "${nameOrId}" no encontrado en la Pokédex.`);
  }
  const data = await response.json();
  return formatPokemonData(data);
}

// Obtener detalles adicionales de la especie (descripción en español, categoría, etc.)
export async function getPokemonSpecies(idOrName) {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
    if (!response.ok) return null;
    const data = await response.json();

    // Obtener texto de sabor en español (o inglés si no hay)
    const flavorTextEs = data.flavor_text_entries?.find(
      entry => entry.language.name === 'es'
    )?.flavor_text?.replace(/[\n\f\r]/g, ' ');

    const flavorTextEn = data.flavor_text_entries?.find(
      entry => entry.language.name === 'en'
    )?.flavor_text?.replace(/[\n\f\r]/g, ' ');

    // Categoría / Género (ej: "Pokémon Ratón")
    const categoryEs = data.genera?.find(g => g.language.name === 'es')?.genus;
    const categoryEn = data.genera?.find(g => g.language.name === 'en')?.genus;

    return {
      description: flavorTextEs || flavorTextEn || 'Sin descripción disponible.',
      category: categoryEs || categoryEn || 'Pokémon',
      generation: data.generation?.name?.toUpperCase() || '',
      isLegendary: data.is_legendary,
      isMythical: data.is_mythical,
      captureRate: data.capture_rate,
      happiness: data.base_happiness
    };
  } catch (error) {
    console.warn('Error fetching species details:', error);
    return null;
  }
}

// Obtener lista paginada de Pokémon con datos completos
export async function getPokemonList(offset = 0, limit = 24) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Error al cargar la lista de Pokémon');
  }
  const data = await response.json();

  // Consultar en paralelo los detalles de los Pokémon en la página
  const detailPromises = data.results.map(p =>
    fetch(p.url)
      .then(res => res.json())
      .then(formatPokemonData)
      .catch(err => {
        console.error('Error fetching detail for', p.name, err);
        return null;
      })
  );

  const pokemonList = (await Promise.all(detailPromises)).filter(Boolean);

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: pokemonList
  };
}

// Obtener Pokémon por tipo
export async function getPokemonByType(type) {
  const response = await fetch(`${BASE_URL}/type/${type}`);
  if (!response.ok) {
    throw new Error(`Error al cargar Pokémon del tipo ${type}`);
  }
  const data = await response.json();
  // Tomar los primeros 30 del tipo
  const sample = data.pokemon.slice(0, 30);

  const detailPromises = sample.map(item =>
    fetch(item.pokemon.url)
      .then(res => res.json())
      .then(formatPokemonData)
      .catch(() => null)
  );

  const list = (await Promise.all(detailPromises)).filter(Boolean);
  return list;
}
