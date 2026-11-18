# ⚡ Pokédex & Mochila de Entrenador (React + Vite)

[![Deploy to GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?logo=github)](https://mayorgac972-dotcom.github.io/PokedeX_3288046/)

🔗 **Demo en vivo**: [https://mayorgac972-dotcom.github.io/PokedeX_3288046/](https://mayorgac972-dotcom.github.io/PokedeX_3288046/)

Una aplicación web moderna e interactiva desarrollada con **React** y **Vite**, que consume la API oficial de Pokémon ([PokéAPI](https://pokeapi.co/)) para explorar criaturas, buscar por nombre o número Pokédex, gestionar mochilas de combate y administrar múltiples perfiles de entrenadores.

![Pikachu Artwork](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

---

## 🚀 Características Principales

1. **Pokédex Completa con Consumo de PokéAPI**:
   - Conexión a `https://pokeapi.co/api/v2/pokemon/{nombre_o_numero}`.
   - Búsqueda en tiempo real por **Nombre** (ej: `pikachu`, `charizard`) o por **Número** (ej: `25`, `150`).
   - Botón de Pokémon al azar (*¡Sorpréndeme!*).
   - Filtros por **Tipos elementales** (Fuego, Agua, Planta, Eléctrico, Dragón, etc.).
   - Filtros por **Regiones y Generaciones** (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar, Paldea).
   - Fichas de detalle con:
     - Ilustraciones oficiales de alta definición.
     - Versión **Variocolor (Shiny)** conmutador en un clic.
     - **Reproductor de sonido / grito oficial** (PokeAPI cries).
     - Descripción oficial de la Pokédex en **Español**.
     - Estadísticas base con barras de progreso dinámicas.
     - Medidas (altura, peso) y habilidades con indicador de habilidad oculta.

2. **🎒 Mochila de Entrenador (Trainer Backpack)**:
   - **Equipo Activo (6 Slots)**: Lleva hasta 6 Pokémon listos para el combate.
   - **Caja de Almacenamiento PC**: Guarda todos los Pokémon capturados que no caben en tu equipo principal.
   - Mueve Pokémon fluidamente entre el equipo de combate y la caja de almacenamiento.
   - Asigna **apodos personalizados** y niveles a tus Pokémon al capturarlos.
   - Marca tus compañeros favoritos con una estrella.
   - Opción para liberar Pokémon a su hábitat natural.

3. **🧢 Perfiles de Entrenadores Pokémon**:
   - Crea múltiples perfiles de entrenadores con avatar e insignia de región.
   - Elige entre 10 sprites icónicos (Red, Leaf, Ethan, Lyra, Lucas, Dawn, Cynthia, etc.).
   - Cada perfil de entrenador mantiene su **propia mochila, equipo y capturas independientes**.
   - Persistencia automática en el navegador mediante `localStorage`.

4. **⚡ Rendimiento y Estilo**:
   - Creado sobre **Vite** para recarga instantánea y empaquetado ultra rápido.
   - Interfaz temática oscura inspirada en los dispositivos Pokédex clásicos y modernos.
   - Animaciones y efectos con confeti al atrapar Pokémon.

---

## 🛠️ Tecnologías Utilizadas

- **React 18** (Hooks, Context API, Components)
- **Vite 6** (Build tool y servidor de desarrollo)
- **PokéAPI REST v2** (Fuente de datos oficial de Pokémon)
- **Lucide React** (Iconografía limpia y moderna)
- **Canvas Confetti** (Efectos visuales de captura)

---

## 📦 Instalación y Ejecución Local

1. Clona el repositorio o navega a la carpeta del proyecto:
   ```bash
   cd pokedex-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:3000`.
