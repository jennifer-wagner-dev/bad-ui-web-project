// ===============================
// HTML-Elemente holen
// Speichert wichtige Elemente der Pokémon-Auswahlseite in Variablen,
// damit sie später per JavaScript verändert werden können.
// ===============================

const pokemonSearchInput = document.querySelector("#pokemonSearchInput");
const pokemonGrid = document.querySelector("#pokemonGrid");
const selectedPokemonImage = document.querySelector("#selectedPokemonImage");
const selectedPokemonNumber = document.querySelector("#selectedPokemonNumber");
const selectedPokemonName = document.querySelector("#selectedPokemonName");
const selectedPokemonTypes = document.querySelector("#selectedPokemonTypes");
const confirmPokemonButton = document.querySelector("#confirmPokemonButton");
const pokemonMessage = document.querySelector("#pokemonMessage");
const pokemonNextLink = document.querySelector("#pokemonNextLink");

// ===============================
// Pokédex-Auswahl
// Lädt die Pokémon-Liste, rendert die Karten und speichert die Auswahl.
// ===============================

// Merkt sich das aktuell angeklickte Pokémon, bevor die Auswahl endgültig bestätigt wird
let currentDraftPokemon = null;

// Startet die Pokémon-Auswahlseite: Liste laden, Grid anzeigen und gespeicherte Auswahl wiederherstellen
async function initializePokedexPage() {
    if (pokemonGrid === null) {
        return;
    }

    pokemonGrid.innerHTML = '<p class="pokedex-loading">Pokédex lädt...</p>';
    await loadPokedexList();
    renderPokemonGrid();
    restoreSelectedPokemonPanel();
}

// Gibt die gefilterte Pokémon-Liste zurück, abhängig vom Suchfeld
function getFilteredPokemonList() {
    const searchTerm = pokemonSearchInput === null ? "" : pokemonSearchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        return pokedexList;
    }

    return pokedexList.filter(function (pokemon) {
        return pokemon.name.includes(searchTerm) || String(pokemon.id) === searchTerm;
    });
}

// Baut das Pokémon-Grid neu auf und zeigt nur passende Pokémon-Karten an
function renderPokemonGrid() {
    if (pokemonGrid === null) {
        return;
    }

    const filteredPokemon = getFilteredPokemonList();

    pokemonGrid.innerHTML = "";

    if (filteredPokemon.length === 0) {
        pokemonGrid.innerHTML = '<p class="pokedex-loading">Kein Pokémon gefunden.</p>';
        return;
    }

    filteredPokemon.forEach(function (pokemon) {
        pokemonGrid.appendChild(createPokemonCard(pokemon));
    });
}

// Prüft, ob ein Pokémon bereits als bestätigte Auswahl im sessionStorage gespeichert ist
function isSavedSelectedPokemon(pokemonId) {
    return sessionStorage.getItem("selectedPokemonId") === String(pokemonId);
}

// Erstellt das innere HTML einer Pokémon-Karte
function createPokemonCardHtml(pokemon) {
    return `
        <div class="pokemon-card-header">
            <span>${formatPokemonNumber(pokemon.id)}</span>
            <span>SCAN</span>
        </div>
        <div class="pokemon-card-screen">
            <img src="" alt="Silhouette von ${formatPokemonName(pokemon.name)}">
        </div>
        <div class="pokemon-card-body">
            <p class="pokemon-card-name">${formatPokemonName(pokemon.name)}</p>
            <div class="pokemon-card-types">
                <span class="type-badge type-unknown">???</span>
            </div>
        </div>
    `;
}

// Wird ausgeführt, wenn die Detaildaten einer Pokémon-Karte nicht geladen werden konnten
function handlePokemonCardLoadError(button) {
    const image = button.querySelector("img");

    if (image !== null) {
        image.src = "images/Enton";
        image.alt = "Ladefehler";
    }

    button.disabled = true;
}

// Wird ausgeführt, wenn die Detaildaten einer Pokémon-Karte erfolgreich geladen wurden
function handlePokemonCardLoadSuccess(button, pokemonInfo) {
    const image = button.querySelector("img");
    const typeContainer = button.querySelector(".pokemon-card-types");

    if (image !== null) {
        image.src = pokemonInfo.spriteUrl;
    }

    // Macht die Karte anklickbar und merkt das Pokémon als aktuelle Auswahl vor
    button.addEventListener("click", function () {
        selectPokemonDraft(pokemonInfo);
    });

    // Wenn dieses Pokémon schon gespeichert war, werden die Typen direkt wieder angezeigt
    if (isSavedSelectedPokemon(pokemonInfo.id)) {
        renderTypeBadges(typeContainer, pokemonInfo.types);
    }
}

// Erstellt eine komplette Pokémon-Karte als Button und lädt die Detaildaten nach
function createPokemonCard(pokemon) {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("pokemon-card-button");
    button.dataset.pokemonId = String(pokemon.id);

    // Bereits gespeicherte Pokémon werden beim Neuladen direkt als aufgedeckt und ausgewählt markiert
    if (isSavedSelectedPokemon(pokemon.id)) {
        button.classList.add("revealed", "selected");
    }

    button.innerHTML = createPokemonCardHtml(pokemon);

    // Detaildaten wie Bild und Typen werden asynchron aus der API geladen
    loadPokemonInfo(pokemon.id).then(function (pokemonInfo) {
        if (pokemonInfo === null) {
            handlePokemonCardLoadError(button);
            return;
        }

        handlePokemonCardLoadSuccess(button, pokemonInfo);
    });

    return button;
}

// Wählt ein Pokémon vorläufig aus, ohne es schon dauerhaft zu speichern
function selectPokemonDraft(pokemonInfo) {
    currentDraftPokemon = pokemonInfo;

    // Entfernt die alte Auswahlmarkierung und markiert nur die aktuell geklickte Karte
    document.querySelectorAll(".pokemon-card-button").forEach(function (card) {
        card.classList.remove("selected");

        if (card.dataset.pokemonId === String(pokemonInfo.id)) {
            card.classList.add("revealed", "selected");
            const typeContainer = card.querySelector(".pokemon-card-types");
            renderTypeBadges(typeContainer, pokemonInfo.types);
        }
    });

    updateSelectedPokemonPanel(pokemonInfo, false);

    if (confirmPokemonButton !== null) {
        confirmPokemonButton.disabled = false;
    }

    if (pokemonMessage !== null) {
        pokemonMessage.textContent = formatPokemonName(pokemonInfo.name) + " wurde aufgedeckt. Auswahl noch bestätigen.";
    }

    setSystemMessage("Pokédex-Eintrag " + formatPokemonNumber(pokemonInfo.id) + " wurde aufgedeckt.");
}

// Aktualisiert das Auswahl-Dock unten auf der Seite mit Bild, Nummer, Name und Typen
function updateSelectedPokemonPanel(pokemonInfo, confirmed) {
    if (selectedPokemonImage !== null) {
        selectedPokemonImage.src = pokemonInfo.spriteUrl;
        selectedPokemonImage.alt = "Ausgewähltes Pokémon: " + formatPokemonName(pokemonInfo.name);
    }

    if (selectedPokemonNumber !== null) {
        selectedPokemonNumber.textContent = formatPokemonNumber(pokemonInfo.id);
    }

    if (selectedPokemonName !== null) {
        selectedPokemonName.textContent = formatPokemonName(pokemonInfo.name);
    }

    renderTypeBadges(selectedPokemonTypes, pokemonInfo.types);

    if (confirmed && pokemonMessage !== null) {
        pokemonMessage.textContent = "Auswahl bestätigt. Du kannst jetzt mit den Trainerdaten fortfahren.";
    }
}

// Speichert das aktuell vorgemerkte Pokémon endgültig im sessionStorage
function confirmPokemonSelection() {
    if (currentDraftPokemon === null) {
        return;
    }

    sessionStorage.setItem("selectedPokemonId", String(currentDraftPokemon.id));
    sessionStorage.setItem("selectedPokemonName", currentDraftPokemon.name);
    sessionStorage.setItem("selectedPokemonSprite", currentDraftPokemon.spriteUrl);
    sessionStorage.setItem("selectedPokemonTypes", currentDraftPokemon.types.join(","));
    sessionStorage.setItem("selectedPokemonSelected", "true");

    updatePokemonNextLink();
    updateSelectedPokemonPanel(currentDraftPokemon, true);

    setSystemMessage("Pokémon bestätigt. Das Terminal akzeptiert diese Entscheidung widerwillig.");
}

// Stellt eine bereits gespeicherte Pokémon-Auswahl beim erneuten Laden der Seite wieder her
function restoreSelectedPokemonPanel() {
    const selectedId = sessionStorage.getItem("selectedPokemonId");
    const selectedName = sessionStorage.getItem("selectedPokemonName");
    const selectedSprite = sessionStorage.getItem("selectedPokemonSprite");
    const selectedTypes = formatPokemonTypes(sessionStorage.getItem("selectedPokemonTypes"));

    if (selectedId === null || selectedName === null || selectedSprite === null) {
        return;
    }

    const pokemonInfo = {
        id: Number(selectedId),
        name: selectedName,
        spriteUrl: selectedSprite,
        types: selectedTypes
    };

    currentDraftPokemon = pokemonInfo;
    updateSelectedPokemonPanel(pokemonInfo, sessionStorage.getItem("selectedPokemonSelected") === "true");
    updatePokemonNextLink();

    if (confirmPokemonButton !== null) {
        confirmPokemonButton.disabled = false;
    }
}

// Aktiviert oder deaktiviert den Weiter-Link abhängig davon, ob die Auswahl bestätigt wurde
function updatePokemonNextLink() {
    if (pokemonNextLink === null) {
        return;
    }

    if (sessionStorage.getItem("selectedPokemonSelected") === "true") {
        pokemonNextLink.classList.remove("disabled");
    } else {
        pokemonNextLink.classList.add("disabled");
    }
}

// Bei jeder Eingabe im Suchfeld wird das Pokémon-Grid neu gefiltert und gerendert
if (pokemonSearchInput !== null) {
    pokemonSearchInput.addEventListener("input", renderPokemonGrid);
}

// Speichert die aktuelle Pokémon-Auswahl nach Klick auf den Bestätigungsbutton
if (confirmPokemonButton !== null) {
    confirmPokemonButton.addEventListener("click", confirmPokemonSelection);
}

// Startet die Initialisierung der Pokémon-Auswahlseite
void initializePokedexPage();