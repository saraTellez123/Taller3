import Pokemon from "../models/Pokemon.js";

 //"../models/Pokemon.js";
const API_URL = "https://pokeapi.co/api/v2/pokemon/"

export async function fetchPokemon(id) {
    try{
        const res = await fetch (API_URL + id);
        if(!res.ok) throw new Error("No se encontro el Pokemon");
        const data = await res.json();

        //extraiga los tipos pa
        const types = data.types.map(t => t.type.name);

        //crea la instancia Pokemon :Vv

        return new Pokemon(
            data.id,
            data.name,
            types,
            data.sprites.other["official-artwork"].front_default
        );

    }catch (error){
        console.error(error);
        return null;
    };
    
    //Extreaer habilidades hermano :VvVvvVvV
    const abilities = data.abilities.map(a=> a.ability.name);

    const stats = data.stats.map(s => ({
        stat: s.stat.name,
        base: s.base_stat
    }));

}