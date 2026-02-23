export function showPokemon(pokemon){
    if(!pokemon) return;

    //Pokemita datos 

    document.getElementById("pokemon-img").src = pokemon.sprite;
    document.getElementById("pokemon-name").textContent = captalize(pokemon.name);
    document.getElementById("pokemon-id").textContent = "#" + pokemon.id.toString().padStart(3,"0");

    //tipos :v

    const typesDiv = document.querySelector(".types");
    typesDiv.innerHTML="";
    pokemon.types.forEach(t =>{
        const span = document.createElement("span");
        span.classList.add("type",t);
        span.textContent = captalize(t);
        typesDiv.appendChild(span);
    });
}
function captalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}
//mostral modal
document.querySelector("#pokemon-img").onclick = () => showModal(pokemon);