
export function showPokemon(pokemon){
    if(!pokemon) return;

    //Pokemita datos 

    document.getElementById("pokemon-img").src = pokemon.sprite;
    document.getElementById("pokemon-name").textContent = capitalize(pokemon.name);
    document.getElementById("pokemon-id").textContent = "#" + pokemon.id.toString().padStart(3,"0");

    //tipos :v

    const typesDiv = document.querySelector(".types");
    typesDiv.innerHTML="";
    pokemon.types.forEach(t =>{
        const span = document.createElement("span");
        span.classList.add("type",t);
        span.textContent = capitalize(t);
        typesDiv.appendChild(span);
    });
}
function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}
//mostral modal


document.querySelector("#pokemon-img").onclick = () => showModal(pokemon);



export function showModal(pokemon){
    if(!pokemon) return;

    document.getElementById("modal-name").textContent =
        capitalize(pokemon.name);

    document.getElementById("modal-img").src =
        pokemon.sprite;

    document.getElementById("modal-id").textContent =
        "#" + pokemon.id.toString().padStart(3,"0");

    document.getElementById("modal-height").textContent =
        pokemon.height;

    document.getElementById("modal-weight").textContent =
        pokemon.weight;

    document.getElementById("modal-abilities").textContent =
        pokemon.abilities.join(", ");

    // pintar stats
    const statsDiv = document.getElementById("modal-stats");
    statsDiv.innerHTML = "";

    pokemon.stats.forEach(s => {
        const p = document.createElement("p");
        p.textContent = `${capitalize(s.stat)}: ${s.base}`;
        statsDiv.appendChild(p);
    });

    // abrir modal
    document.getElementById("pokemon-modal")
        .classList.remove("hidden");
}

const modal = document.getElementById("pokemon-modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("close-modal");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});