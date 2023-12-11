/**
 * @typedef {Object} Stats
 * @property {String} name
 * @property {Number} value
 */

const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')


const maxRecords = 151
const limit = 10
let offset = 0;

/**
 * Obtém a div de status
 * @param {Stats[]} stats
 * @returns {HTMLDivElement} 
 */
function divBaseStats(stats){
    
    
  
    let ul = document.createElement("ul")

    //Mapeando lista de dados em li de elementos span
    let liItems = stats.map((s) => {
        let spName = document.createElement("span")
        spName.innerText = s.name
        spName.classList.add("stat")

        let spValue = document.createElement("span")
        spValue.innerText = s.value
        spValue.classList.add("stat")

        let ulItem = document.createElement("li")
        ulItem.appendChild(spName)
        ulItem.appendChild(spValue)

        return ulItem

    })

    for (const li of liItems)
        ul.appendChild(li)

    let divContainer = document.createElement("div")
    divContainer.appendChild(ul)
    divContainer.classList.add("stats-container")
    return divContainer

    
}



async function convertPokemonToLi(pokemon) {

    //Obtendo nomes apresentáveis dos stats e seus valores
    let mappedStatsPromisses = pokemon.stats.map(async (stats) => {
        let obj = {
            name : await statsApi.getName(stats.stat.name),
            value : stats.base_stat
            
        }
        return obj
    })

    let mappedStats = await Promise.all(mappedStatsPromisses);
    

    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            
                <span class="name">${pokemon.name}</span>
                <ol class="types horizontal">
                    ${pokemon.types.map((type) => `<li class="type ${type} borded">${type}</li>`).join('')}
                </ol>
           

            <div class="detail">
                ${divBaseStats(mappedStats).outerHTML}
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

async function loadPokemonItens(offset, limit) {

    let pokemons = await  pokeApi.getPokemons(offset, limit)
        let convertPromosses = pokemons.map(async (p) => await convertPokemonToLi(p))
        let convertResults = await Promise.all(convertPromosses)
        const newHtml = convertResults.join('')
        pokemonList.innerHTML += newHtml
    
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', async () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        await loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        await loadPokemonItens(offset, limit)
    }
})