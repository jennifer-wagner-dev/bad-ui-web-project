// ===============================
// PokeAPI
// Lädt Pokémon-Daten aus der externen PokeAPI und bereitet sie für die App auf.
// ===============================

// Basisadresse der PokeAPI; alle API-Anfragen werden daraus zusammengesetzt
const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";
// Begrenzung auf die ersten 151 Pokémon, also Generation 1 / Kanto
const POKEDEX_LIMIT = 151;

// Zwischenspeicher für die geladene Pokédex-Liste, damit sie nicht mehrfach neu geladen werden muss
let pokedexList = [];

// Sucht aus den API-Daten ein passendes Pokémon-Bild heraus
function getPokemonSpriteUrl(pokemonData) {
    return (
        pokemonData["sprites"]?.["front_default"] ||
        pokemonData["sprites"]?.["other"]?.["official-artwork"]?.["front_default"] ||
        ""
    );
}

// Holt alle Typen eines Pokémon aus den API-Daten, z. B. fire, water oder grass
function getPokemonTypes(pokemonData) {
    return pokemonData["types"].map(function (typeInfo) {
        return typeInfo["type"]["name"];
    });
}

// Erstellt aus den umfangreichen API-Daten ein kleineres Objekt, das die App leichter verwenden kann
function createPokemonInfo(pokemonData) {
    return {
        id: pokemonData["id"],
        name: pokemonData["name"],
        spriteUrl: getPokemonSpriteUrl(pokemonData),
        types: getPokemonTypes(pokemonData)
    };
}

// Lädt Detaildaten zu einem einzelnen Pokémon anhand von ID oder Name
async function loadPokemonInfo(pokemonIdOrName) {
    try {
        const response = await fetch(POKE_API_BASE_URL + "/pokemon/" + pokemonIdOrName);

        // Bei fehlerhafter Antwort wird null zurückgegeben, damit die App kontrolliert reagieren kann
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return createPokemonInfo(data);
    } catch (error) {
        console.error("Pokémon konnte nicht geladen werden:", error);
        return null;
    }
}

// Erstellt einen einfachen Pokédex-Eintrag aus der Listen-Antwort der API
function createPokedexEntry(pokemon, index) {
    return {
        id: index + 1,
        name: pokemon["name"]
    };
}

// Lädt die Pokédex-Liste mit den ersten 151 Pokémon
async function loadPokedexList() {
    // Wenn die Liste bereits geladen wurde, wird der Zwischenspeicher verwendet
    if (pokedexList.length > 0) {
        return pokedexList;
    }

    try {
        const response = await fetch(POKE_API_BASE_URL + "/pokemon?limit=" + POKEDEX_LIMIT);

        // Bei fehlerhafter Antwort wird eine leere Liste zurückgegeben
        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        const pokemonResults = data["results"];

        // Sicherheitsprüfung: Die App arbeitet nur weiter, wenn wirklich eine Liste zurückkommt
        if (!Array.isArray(pokemonResults)) {
            return [];
        }

        // Wandelt die API-Ergebnisse in einfache Pokédex-Einträge für die App um
        pokedexList = pokemonResults.map(createPokedexEntry);

        return pokedexList;
    } catch (error) {
        console.error("Pokédex-Liste konnte nicht geladen werden:", error);
        return [];
    }
}