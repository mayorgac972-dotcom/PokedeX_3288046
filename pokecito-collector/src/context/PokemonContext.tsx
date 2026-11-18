import React, {createContext, useContext, useState, useEffect} from 'react';

export interface PokemonTarjeta {
    id: number;
    name: string;
    type: string;
    image: string;
    isFavorite?: boolean;
}

export interface PokemonContext {
    id: number;
    fullName: string;
    document: {type: string: dni: string};
    dateRegistrer: string;
}

interface PoquemonContextType {
    entrenadores: Trainer[];
    entrenadorActivo: Trainer | null;
    mochilaActual: PokemonTarjeta[];
    guardarPokemonEnMochila: (Pokemon: PokemonTarjeta)=> void;
    registrarEntrenador: (usuario: Trainer)=> void;
    seleccionarFavorito: (pokemonId: Number)=> void;
    selecionarEntrenador: (usuario: Trainer)=> void;
    eliminarPokemonDeMochila: (pokemonId: number)=> void;
}

const PokemonContext = createContext < PokemonContextType | undefined >(undefined);

export const PokemonProvaider: React.FC<{children: React.ReacNode}> = ({children}) => {

    const [entrenadores, setEntrenadores] = useState<Trainer[]>([]);
    const [entrenadorActivo, setEntreadorActivo]= useState<Trainer |null> (null);
    const [mochilaActual, setMochilaActual]= useState<PokemonTarjeta[]>([]);
}