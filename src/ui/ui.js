import { fetchEvolutions } from "../services/api.js";

//Variable global para saber el Pokémon actual
let currentPokemon = null;

//Mostrar el pokemon de carta
export function showPokemon(pokemon){
    if(!pokemon) return;
    currentPokemon = pokemon;

    //Pokemita datos 
    document.getElementById("pokemon-img").src = pokemon.sprite;
    document.getElementById("pokemon-name").textContent = capitalize(pokemon.name);
    document.getElementById("pokemon-id").textContent = "#" + pokemon.id.toString().padStart(3,"0");

    //tipos
    const typesDiv = document.querySelector(".types");
    typesDiv.innerHTML="";
    pokemon.types.forEach(t =>{
        const span = document.createElement("span");
        span.classList.add("type",t);
        span.textContent = capitalize(t);
        typesDiv.appendChild(span);
    });
}

//Mayusculas
function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//Mostrar modal al click en la imagen
document.querySelector("#pokemon-img").onclick = () => showModal(currentPokemon);

//Ver modal, ver pokemon a detalle
export function showModal(pokemon){
    if(!pokemon) return;

    document.getElementById("modal-name").textContent = capitalize(pokemon.name);
    document.getElementById("modal-img").src = pokemon.sprite;
    document.getElementById("modal-id").textContent = "#" + pokemon.id.toString().padStart(3,"0");
    document.getElementById("modal-height").textContent = (pokemon.height / 10).toFixed(1);
    document.getElementById("modal-weight").textContent = (pokemon.weight / 10).toFixed(1);
    document.getElementById("modal-abilities").textContent = pokemon.abilities.join(", ");

    //stats con sus clases
    const statsDiv = document.getElementById("modal-stats");
    statsDiv.innerHTML = "<h3>Estadísticas</h3>";
    pokemon.stats.forEach(s => {
        const statRow = document.createElement("div");
        statRow.classList.add("stat-row");
        statRow.innerHTML = `
            <span class="stat-name">${capitalize(s.stat)}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${s.base / 2}%"></div>
            </div>
            <span class="stat-value">${s.base}</span>
        `;
        statsDiv.appendChild(statRow);
    });

    //Mostrar modal
    const modal = document.getElementById("pokemon-modal");
    modal.classList.remove("hidden");

    //Toggle de evoluciones
    const toggleBtn = document.getElementById("toggle-evolutions");
    const evolutionsDiv = document.getElementById("modal-evolutions");

    toggleBtn.onclick = async () => {
        if (!currentPokemon) return;

        //Si ya está visible, ocultamos
        if(!evolutionsDiv.classList.contains("hidden")){
            evolutionsDiv.classList.add("hidden");
            toggleBtn.textContent = "Ver Evoluciones";
            evolutionsDiv.innerHTML = "";
            return;
        }

        //Mostrar loader
        evolutionsDiv.innerHTML = "<p>Cargando evoluciones...</p>";
        evolutionsDiv.classList.remove("hidden");
        toggleBtn.textContent = "Ocultar Evoluciones";

        //Fetch de evoluciones
        const evolutions = await fetchEvolutions(currentPokemon.name);

        //Si solo tiene uno, no evoluciona
        if(evolutions.length <= 1){
            evolutionsDiv.innerHTML = "<p>Este Pokémon no tiene evoluciones 😢</p>";
            return;
        }

        //Pintar evoluciones
        evolutionsDiv.innerHTML = "<h3>Evoluciones:</h3>";
        evolutions.forEach(evo => {
            evolutionsDiv.innerHTML += `
                <div class="evolution-card">
                    <img src="${evo.sprite}" alt="${evo.name}">
                    <span>${capitalize(evo.name)}</span>
                </div>
            `;
        });
    };
}

//operacion del boton modal
const modal = document.getElementById("pokemon-modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("close-modal");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");

  //Limpiar evoluciones y resetear botón
  const evolutionsDiv = document.getElementById("modal-evolutions");
  const toggleBtn = document.getElementById("toggle-evolutions");

  evolutionsDiv.classList.add("hidden");
  evolutionsDiv.innerHTML = "";
  toggleBtn.textContent = "Ver Evoluciones";
});