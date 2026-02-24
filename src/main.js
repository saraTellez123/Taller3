import { fetchPokemon } from "./services/api.js";
import { showPokemon } from "./ui/ui.js";
import { showModal } from "./ui/ui.js";

let current = 25; 
let currentPokemon = null; 

async function loadPokemon(id) {
    const pokemon = await fetchPokemon(id);
    currentPokemon = pokemon; //establece el pokemon
    showPokemon(pokemon);
}

// Inicial
loadPokemon(current);

// Navegacion
document.querySelector("#next").addEventListener("click", () => {
    current++;
    loadPokemon(current);
});

document.querySelector("#prev").addEventListener("click", () => {
    if (current > 1) current--;
    loadPokemon(current);
});

document.getElementById("openModal").addEventListener("click", () => {
    if (currentPokemon) {
        showModal(currentPokemon);
    }
});