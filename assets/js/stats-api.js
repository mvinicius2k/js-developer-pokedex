
const statsApi = {}

function endpoint(id){
    return `https://pokeapi.co/api/v2/stat/${id}`
}

/**
* 
* @param {String} id 
* @returns {String} O nome de acordo com a linguagem ou o nome de id
*/
statsApi.getName = async (id, language = "en") => {
   let result = await fetch(endpoint(id))
   let statsJson = await result.json()

   let stat = statsJson.names.find(n => n.language.name === language)
   if(stat == null)
       return statsJson.name
   return stat.name
}