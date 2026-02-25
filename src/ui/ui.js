import { fetchEvolutions } from "../services/api.js";

//Variable global para saber el Pokémon actual
let currentPokemon = null;

//Detectar si es legendario
async function isLegendary(name){
    try{
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
        const data = await res.json();
        return data.is_legendary;
    }catch(err){
        console.error(err);
        return false;
    }
}

//Mostrar el pokemon de carta
export async function showPokemon(pokemon){
    if(!pokemon) return;
    currentPokemon = pokemon;

    const card = document.querySelector(".card");

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

    //Aplicar estilo legendario
    if(await isLegendary(pokemon.name)){
        card.classList.add("legendary");
    } else {
        card.classList.remove("legendary");
    }
}

//Mayusculas
function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//Mostrar modal al click en la imagen
document.querySelector("#pokemon-img").onclick = () => showModal(currentPokemon);

//Ver modal
export function showModal(pokemon){
    if(!pokemon) return;

    document.getElementById("modal-name").textContent = capitalize(pokemon.name);
    document.getElementById("modal-img").src = pokemon.sprite;
    document.getElementById("modal-id").textContent = "#" + pokemon.id.toString().padStart(3,"0");
    document.getElementById("modal-height").textContent = (pokemon.height / 10).toFixed(1);
    document.getElementById("modal-weight").textContent = (pokemon.weight / 10).toFixed(1);
    document.getElementById("modal-abilities").textContent = pokemon.abilities.join(", ");

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

    const modal = document.getElementById("pokemon-modal");
    modal.classList.remove("hidden");

    const toggleBtn = document.getElementById("toggle-evolutions");
    const evolutionsDiv = document.getElementById("modal-evolutions");

    toggleBtn.onclick = async () => {
        if (!currentPokemon) return;

        if(!evolutionsDiv.classList.contains("hidden")){
            evolutionsDiv.classList.add("hidden");
            toggleBtn.textContent = "Ver Evoluciones";
            evolutionsDiv.innerHTML = "";
            return;
        }

        evolutionsDiv.innerHTML = "<p>Cargando evoluciones...</p>";
        evolutionsDiv.classList.remove("hidden");
        toggleBtn.textContent = "Ocultar Evoluciones";

        const evolutions = await fetchEvolutions(currentPokemon.name);

        if(evolutions.length <= 1){
            evolutionsDiv.innerHTML = "<p>Este Pokémon no tiene evoluciones</p>";
            return;
        }

        evolutionsDiv.innerHTML = "<h3>Evoluciones:</h3>";

        evolutions.forEach(evo => {

            const card = document.createElement("div");
            card.classList.add("evolution-card");

            const img = document.createElement("img");
            img.src = evo.sprite;
            img.alt = evo.name;
            img.style.cursor = "pointer";

            img.addEventListener("click", async () => {

                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo.name}`);
                const data = await res.json();

                const newPokemon = {
                    id: data.id,
                    name: data.name,
                    sprite: data.sprites.front_default,
                    types: data.types.map(t => t.type.name),
                    height: data.height,
                    weight: data.weight,
                    abilities: data.abilities.map(a => a.ability.name),
                    stats: data.stats.map(s => ({
                        stat: s.stat.name,
                        base: s.base_stat
                    }))
                };

                showPokemon(newPokemon);
                modal.classList.add("hidden");

                evolutionsDiv.classList.add("hidden");
                evolutionsDiv.innerHTML = "";
                toggleBtn.textContent = "Ver Evoluciones";
            });

            const span = document.createElement("span");
            span.textContent = capitalize(evo.name);

            card.appendChild(img);
            card.appendChild(span);
            evolutionsDiv.appendChild(card);
        });
    };
}

//Botones modal
const modal = document.getElementById("pokemon-modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("close-modal");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");

  const evolutionsDiv = document.getElementById("modal-evolutions");
  const toggleBtn = document.getElementById("toggle-evolutions");

  evolutionsDiv.classList.add("hidden");
  evolutionsDiv.innerHTML = "";
  toggleBtn.textContent = "Ver Evoluciones";
});