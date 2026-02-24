import Pokemon from "../models/pokemon.js";
const API_URL = "https://pokeapi.co/api/v2/pokemon/"

export async function fetchPokemon(id) {
    try{
        const res = await fetch(API_URL + id);
        if(!res.ok) throw new Error("No se encontró el Pokémon");
        const data = await res.json();

        const types = data.types.map(t => t.type.name);

        const abilities = data.abilities.map(a => a.ability.name);

        const stats = data.stats.map(s => ({
            stat: s.stat.name,
            base: s.base_stat
        }));

        return new Pokemon(
            data.id,
            data.name,
            types,
            data.sprites.other["official-artwork"].front_default,
            data.height,
            data.weight,
            abilities,
            stats
        );

    } catch (error){
        console.error(error);
        return null;
    }
}

export async function fetchEvolutions(name) {
    try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        if (!speciesRes.ok) throw new Error("No se encontró la especie");
        const speciesData = await speciesRes.json();

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();

        const evolutions = [];
        function traverse(chain) {
            evolutions.push(chain.species.name);
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(evo => traverse(evo));
            }
        }
        traverse(evolutionData.chain);

        const result = [];
        for (let evoName of evolutions) {
            const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
            const pokeData = await pokeRes.json();
            result.push({
                name: pokeData.name,
                sprite: pokeData.sprites.other['official-artwork'].front_default
            });
        }

        return result;
    } catch (error) {
        console.error("Error fetchEvolutions:", error);
        return [];
    }
}
