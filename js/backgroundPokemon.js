// ===============================
// Hintergrund-Pokémon auf jeder Seite
// Erzeugt zufällig fliegende Pokémon im Hintergrund und entfernt sie später wieder.
// ===============================

// Maximale Anzahl an Hintergrund-Pokémon, damit die Seite nicht überladen wird
const MAX_AMBIENT_POKEMON = 48;
// Anzahl der Pokémon aus Generation 1, aus denen zufällig gewählt wird
const AMBIENT_FIRST_GEN_POKEMON_COUNT = 151;
// Anzahl der Pokémon, die direkt beim Laden der Seite erscheinen
const INITIAL_AMBIENT_POKEMON_COUNT = 18;
// Zeitabstand, in dem neue Hintergrund-Pokémon erzeugt werden
const AMBIENT_SPAWN_INTERVAL = 1200;
// Nach dieser Zeit wird ein Hintergrund-Pokémon wieder aus dem HTML entfernt
const AMBIENT_REMOVE_DELAY = 47000;

// Zwischenspeicher für bereits geladene Pokémon-Daten, damit dieselben Daten nicht mehrfach von der API geladen werden
const ambientPokemonCache = {};

// Sucht den Hintergrund-Container oder erstellt ihn automatisch, falls er auf einer Seite fehlt
function getAmbientPokemonBackground() {
    let background = document.querySelector("#ambientPokemonBackground");

    if (background === null) {
        background = document.createElement("div");
        background.id = "ambientPokemonBackground";
        background.classList.add("ambient-pokemon-background");

        document.body.prepend(background);
    }

    return background;
}

// Lädt Pokémon-Daten für den Hintergrund und speichert sie im Cache
async function getAmbientPokemonInfo(pokemonId) {
    if (ambientPokemonCache[pokemonId] !== undefined) {
        return ambientPokemonCache[pokemonId];
    }

    const pokemonInfo = await loadPokemonInfo(pokemonId);
    ambientPokemonCache[pokemonId] = pokemonInfo;

    return pokemonInfo;
}

// Wählt zufällig aus, in welche Richtung ein Hintergrund-Pokémon fliegen soll
function getRandomAmbientMovementClass() {
    const movementClasses = [
        "ambient-left-right",
        "ambient-right-left",
        "ambient-top-drop",
        "ambient-bottom-rise",
        "ambient-diagonal-left",
        "ambient-diagonal-right",
        "ambient-arc-left",
        "ambient-arc-right"
    ];

    const randomIndex = getRandomNumber(0, movementClasses.length - 1);
    return movementClasses[randomIndex];
}

// Erstellt das img-Element für ein Hintergrund-Pokémon und weist ihm die passende Flugklasse zu
function createAmbientPokemonImage(pokemonInfo, movementClass) {
    const image = document.createElement("img");

    image.classList.add("ambient-pokemon", movementClass);
    image.src = pokemonInfo.spriteUrl;
    image.alt = "Hintergrund-Pokémon: " + formatPokemonName(pokemonInfo.name);

    return image;
}

// Setzt zufällige CSS-Variablen für Dauer, Größe, Deckkraft und Flugversatz
function applyRandomAmbientStyles(image) {
    image.style.setProperty("--ambient-duration", getRandomNumber(24, 46) + "s");
    image.style.setProperty("--ambient-size", getRandomNumber(100, 190) + "px");
    image.style.setProperty("--ambient-opacity", String(getRandomNumber(22, 38) / 100));
    image.style.setProperty("--ambient-x", getRandomNumber(-260, 260) + "px");
    image.style.setProperty("--ambient-y", getRandomNumber(-190, 190) + "px");
}

// Setzt die Startposition passend zur Flugrichtung, damit Pokémon an unterschiedlichen Stellen erscheinen
function applyAmbientStartPosition(image, movementClass) {
    const horizontalMovementClasses = [
        "ambient-left-right",
        "ambient-right-left",
        "ambient-arc-left",
        "ambient-arc-right"
    ];

    const verticalMovementClasses = [
        "ambient-top-drop",
        "ambient-bottom-rise"
    ];

    if (horizontalMovementClasses.includes(movementClass)) {
        image.style.top = getRandomNumber(4, 88) + "vh";
    }

    if (verticalMovementClasses.includes(movementClass)) {
        image.style.left = getRandomNumber(0, 92) + "vw";
    }
}

// Erzeugt ein einzelnes zufälliges Hintergrund-Pokémon und fügt es in die Hintergrund-Ebene ein
async function spawnAmbientPokemon(startAlreadyMoving = false) {
    const background = getAmbientPokemonBackground();

    // Verhindert, dass zu viele Pokémon gleichzeitig im Hintergrund sind
    if (background.children.length >= MAX_AMBIENT_POKEMON) {
        return;
    }

    const pokemonId = getRandomNumber(1, AMBIENT_FIRST_GEN_POKEMON_COUNT);
    const pokemonInfo = await getAmbientPokemonInfo(pokemonId);

    // Falls die API keine Daten liefert, wird kein Pokémon erzeugt
    if (pokemonInfo === null) {
        return;
    }

    const movementClass = getRandomAmbientMovementClass();
    const image = createAmbientPokemonImage(pokemonInfo, movementClass);

    applyRandomAmbientStyles(image);

    // Beim Seitenstart wirkt es dadurch so, als wären die Pokémon schon mitten in der Bewegung
    if (startAlreadyMoving) {
        image.style.animationDelay = "-" + getRandomNumber(6, 22) + "s";
    }

    applyAmbientStartPosition(image, movementClass);

    background.appendChild(image);

    // Entfernt das Pokémon nach der Animation wieder aus dem DOM
    setTimeout(function () {
        image.remove();
    }, AMBIENT_REMOVE_DELAY);
}

// Speichert die ID des Intervalls, damit es später wieder gestoppt werden kann
let ambientIntervalId = null;

// Startet das regelmäßige Erzeugen neuer Hintergrund-Pokémon
function startAmbientInterval() {
    if (ambientIntervalId !== null) return;
    ambientIntervalId = setInterval(function () {
        void spawnAmbientPokemon(false);
    }, AMBIENT_SPAWN_INTERVAL);
}

// Stoppt das regelmäßige Erzeugen neuer Hintergrund-Pokémon
function stopAmbientInterval() {
    clearInterval(ambientIntervalId);
    ambientIntervalId = null;
}

// Initialisiert den Pokémon-Hintergrund beim Laden einer Seite
function initializeAmbientPokemonBackground() {
    getAmbientPokemonBackground();

    // Direkt mehrere Pokémon starten, die schon in Bewegung sind
    for (let i = 0; i < INITIAL_AMBIENT_POKEMON_COUNT; i++) {
        void spawnAmbientPokemon(true);
    }

    // Danach regelmäßig weitere Pokémon erzeugen
    startAmbientInterval();

    // Wenn der Tab nicht sichtbar ist, werden keine neuen Pokémon erzeugt
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopAmbientInterval();
        } else {
            startAmbientInterval();
        }
    });
}