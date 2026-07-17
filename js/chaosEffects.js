// Bereich im HTML, in dem die fliegenden Chaos-Pokémon eingefügt werden
const pokemonChaosArea = document.querySelector("#pokemonChaosArea");

// Anzahl der Pokémon aus Generation 1
const CHAOS_FIRST_GEN_POKEMON_COUNT = 151;
// Anzahl der Pokémon, die pro Ladeblock von der API geholt werden
const CHAOS_BATCH_SIZE = 25;
// Mindestanzahl an Pokémon, die bei einem Klick gleichzeitig losfliegen
const MIN_CHAOS_SPAWN_COUNT = 25;
// Höchstanzahl an Pokémon, die bei einem Klick gleichzeitig losfliegen
const MAX_CHAOS_SPAWN_COUNT = 45;
// Wartezeit zwischen zwei Klick-Chaos-Aktionen, damit nicht zu viele Pokémon gleichzeitig erzeugt werden
const POKEMON_CHAOS_COOLDOWN = 2000;

// ===============================
// Meme / Pokémon-Chaos
// Zeigt zufällige Fehlermeldungen mit Pokémon-Bildern an.
// ===============================

// Liste aller möglichen Meme-Meldungen mit Text und passendem Bild
const memeMessages = [
    {
        text: "SYSTEMFEHLER 504: \nDie Anfrage konnte nicht weitergeleitet werden. \nBegründung: \nRelaxo blockiert das Gateway.",
        image: "../img/relaxo.png"
    },
    {
        text: "DATENBANKWARNUNG: \nDie Abfrage wurde gestartet, aber nicht verstanden. \nEnton meldet starke Kopfschmerzen.",
        image: "../img/enton.png"
    },
    {
        text: "STATUS 102: \nAntrag befindet sich in Prüfung. \nZuständiger Sachbearbeiter: Amonitas.",
        image: "../img/amonitas.png"
    },
    {
        text: "FEHLER 500: \nInterner Serverfehler. \nMögliche Ursache: \nSmogon im Serverraum erkannt.",
        image: "../img/smogon.png"
    },
    {
        text: "SICHERHEITSHINWEIS: \nMehrfache Code-Duplizierung erkannt. \nVerdacht auf Ditto-basierte Programmstruktur.",
        image: "../img/ditto.png"
    }
];

// Merkt sich das zuletzt gezeigte Meme, damit nicht zweimal hintereinander dasselbe erscheint
let lastMemeIndex = -1;

// Wählt eine zufällige Meme-Meldung aus, aber nicht direkt dieselbe wie zuvor
function getRandomMemeMessage() {
    let randomIndex = getRandomNumber(0, memeMessages.length - 1);

    while (randomIndex === lastMemeIndex) {
        randomIndex = getRandomNumber(0, memeMessages.length - 1);
    }

    lastMemeIndex = randomIndex;

    return memeMessages[randomIndex];
}

// Erstellt das Meme-Overlay im HTML, falls es noch nicht existiert
function createMemeOverlay() {
    const existingOverlay = document.querySelector("#memeOverlay");

    if (existingOverlay !== null) {
        return existingOverlay;
    }

    const overlay = document.createElement("div");
    overlay.id = "memeOverlay";
    overlay.classList.add("meme-overlay", "hidden");

    const box = document.createElement("div");
    box.classList.add("meme-box");

    const label = document.createElement("div");
    label.classList.add("meme-label");
    label.textContent = "Pokédex-Hinweis";

    // Bildbereich für das Pokémon-Meme im Overlay
    const image = document.createElement("img");
    image.id = "memeImage";
    image.classList.add("meme-image");

    // Textbereich für die zufällige Meme-Fehlermeldung
    const text = document.createElement("p");
    text.id = "memeText";
    text.classList.add("meme-text");

    box.appendChild(label);
    box.appendChild(image); // Bild wird unter dem Label eingefügt
    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    return overlay;
}

// Zeigt ein zufälliges Meme-Overlay an, außer auf der Prüfungsseite
function showRandomMemeOverlay() {
    const currentPage = window.location.pathname.split("/").pop();

    // Auf der Prüfungsseite wird kein Meme-Overlay angezeigt, damit der Prüfablauf nicht gestört wird
    if (currentPage === "pruefung.html") {
        return;
    }

    const overlay = createMemeOverlay();
    const text = document.querySelector("#memeText");
    const image = document.querySelector("#memeImage"); // Holt die Referenz auf das Bild

    if (text === null || image === null) {
        return;
    }

    const currentMeme = getRandomMemeMessage();

    // Setzt Text und Bild des ausgewählten Memes in das Overlay
    text.textContent = currentMeme.text; // Holt nur den Text
    image.src = currentMeme.image;       // Setzt den Pfad zum Bild (z.B. img/relaxo.png)
    image.alt = currentMeme.text;

    overlay.classList.remove("hidden");

    // Zählt in dieser Browser-Session mit, wie oft ein Meme angezeigt wurde
    const currentMemeCount = Number(sessionStorage.getItem("memeCount") || "0");
    sessionStorage.setItem("memeCount", String(currentMemeCount + 1));

    // Blendet das Overlay nach kurzer Zeit wieder aus
    setTimeout(function () {
        overlay.classList.add("hidden");
    }, 5500);
}
// Startet den Meme-Timer: zuerst nach 12 Sekunden, danach alle 30 Sekunden
function startMemeOverlayTimer() {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "pruefung.html") {
        return;
    }

    setTimeout(function () {
        showRandomMemeOverlay();

        setInterval(function () {
            showRandomMemeOverlay();
        }, 20000);
    }, 12000);
}

// ===============================
// 151 Pokémon bei jedem Klick
// ===============================

// Zwischenspeicher für alle geladenen Pokémon, die für das Klick-Chaos verwendet werden
let pokemonChaosCache = [];
// Verhindert, dass der Cache mehrfach gleichzeitig geladen wird
let pokemonChaosCacheIsLoading = false;

// Alle 151 Pokémon einmal laden und zwischenspeichern
async function preloadPokemonChaosCache() {
    if (pokemonChaosCache.length === CHAOS_FIRST_GEN_POKEMON_COUNT || pokemonChaosCacheIsLoading) {
        return;
    }

    pokemonChaosCacheIsLoading = true;

    // Die Pokémon werden blockweise geladen, damit nicht 151 API-Anfragen gleichzeitig gestartet werden
    for (let i = 1; i <= CHAOS_FIRST_GEN_POKEMON_COUNT; i += CHAOS_BATCH_SIZE) {
        const batch = [];

        for (let j = i; j < i + CHAOS_BATCH_SIZE && j <= CHAOS_FIRST_GEN_POKEMON_COUNT; j++) {
            batch.push(loadPokemonInfo(j));
        }

        const loadedBatch = await Promise.all(batch);

        pokemonChaosCache.push(...loadedBatch.filter(function (pokemonInfo) {
            return pokemonInfo !== null;
        }));

        // Kurze Pause zwischen den Blöcken, damit das Laden etwas schonender abläuft
        await wait(10);
    }

    pokemonChaosCacheIsLoading = false;
}

// Wählt zufällig eine CSS-Flugklasse für ein Chaos-Pokémon aus
function getRandomChaosMovementClass() {
    const movementClasses = [
        "chaos-left-right",
        "chaos-right-left",
        "chaos-top-drop",
        "chaos-bottom-rise",
        "chaos-arc-left",
        "chaos-arc-right"
    ];

    const randomIndex = getRandomNumber(0, movementClasses.length - 1);
    return movementClasses[randomIndex];
}

// Erstellt zufällige Bewegungswerte für Größe, Dauer, Startposition, Versatz und Rotation
function createRandomChaosSettings() {
    return {
        size: getRandomNumber(120, 260),
        duration: (getRandomNumber(30, 70) / 10).toFixed(2),
        delay: (getRandomNumber(0, 150) / 100).toFixed(2),
        pulseDuration: (getRandomNumber(8, 20) / 10).toFixed(2),
        yOffset: getRandomNumber(-200, 200),
        xOffset: getRandomNumber(-200, 200),
        startY: getRandomNumber(10, 85),
        startX: getRandomNumber(10, 85),
        rotate: getRandomNumber(-360, 360)
    };
}

// Übergibt die zufälligen Bewegungswerte als CSS-Variablen an das Wrapper-Element
function applyChaosSettingsToWrapper(wrapper, settings) {
    wrapper.style.setProperty("--chaos-size", settings.size + "px");
    wrapper.style.setProperty("--movement-duration", settings.duration + "s");
    wrapper.style.setProperty("--movement-delay", settings.delay + "s");
    wrapper.style.setProperty("--chaos-y-offset", settings.yOffset + "px");
    wrapper.style.setProperty("--chaos-x-offset", settings.xOffset + "px");
    wrapper.style.setProperty("--start-y", settings.startY + "%");
    wrapper.style.setProperty("--start-x", settings.startX + "%");
    wrapper.style.setProperty("--chaos-rotate", settings.rotate + "deg");
}

// Erstellt das Bild-Element für ein fliegendes Chaos-Pokémon
function createChaosPokemonImage(pokemonInfo, settings) {
    const image = document.createElement("img");

    image.classList.add("pokemon-chaos-image");
    image.src = pokemonInfo.spriteUrl;
    image.alt = "Chaotisch fliegendes Pokémon";
    image.style.setProperty("--pulse-duration", settings.pulseDuration + "s");

    return image;
}
// Lässt ein einzelnes Pokémon aus dem Cache über den Bildschirm fliegen
function spawnCachedFlyingPokemon(pokemonInfo) {
    if (pokemonChaosArea === null) {
        return;
    }

    const movementClass = getRandomChaosMovementClass();
    const settings = createRandomChaosSettings();

    const wrapper = document.createElement("div");
    wrapper.classList.add("pokemon-movement", movementClass);

    applyChaosSettingsToWrapper(wrapper, settings);

    const image = createChaosPokemonImage(pokemonInfo, settings);

    wrapper.appendChild(image);
    pokemonChaosArea.appendChild(wrapper);

    // Nach Ende der CSS-Animation wird das Element wieder aus dem HTML entfernt
    wrapper.addEventListener("animationend", function () {
        wrapper.remove();
    });
}

// Erstellt eine zufällig gemischte Kopie des Pokémon-Caches
function getShuffledPokemonChaosCache() {
    return [...pokemonChaosCache].sort(function () {
        return 0.5 - Math.random();
    });
}

// Startet ein Pokémon leicht verzögert, damit nicht alle exakt gleichzeitig losfliegen
function spawnPokemonWithDelay(pokemonInfo, index) {
    setTimeout(function () {
        spawnCachedFlyingPokemon(pokemonInfo);
    }, index * getRandomNumber(10, 50));
}

// Lässt eine zufällige Anzahl an Gen-1-Pokémon über den Bildschirm fliegen
async function spawnAllFirstGenPokemon() {
    if (pokemonChaosArea === null) {
        return;
    }

    // Falls der Cache noch nicht vollständig geladen ist, wird er vor dem Chaos geladen
    if (pokemonChaosCache.length < CHAOS_FIRST_GEN_POKEMON_COUNT) {
        setSystemMessage("Pokédex lädt alle 151 Pokémon für maximalen Unfug vor...");
        await preloadPokemonChaosCache();
    }

    const spawnCount = getRandomNumber(MIN_CHAOS_SPAWN_COUNT, MAX_CHAOS_SPAWN_COUNT);
    const shuffledCache = getShuffledPokemonChaosCache();

    for (let i = 0; i < spawnCount; i++) {
        const pokemonInfo = shuffledCache[i];

        if (pokemonInfo !== undefined) {
            spawnPokemonWithDelay(pokemonInfo, i);
        }
    }

    // Zählt in dieser Browser-Session mit, wie oft das Klick-Chaos ausgelöst wurde
    const currentChaosCount = Number(sessionStorage.getItem("pokemonChaosCount") || "0");
    sessionStorage.setItem("pokemonChaosCount", String(currentChaosCount + 1));
}

// Speichert den Zeitpunkt des letzten Klick-Chaos
let lastPokemonChaosTime = 0;

// Aktiviert das Klick-Chaos für die gesamte Seite
function activatePokemonClickChaos() {
    void preloadPokemonChaosCache();

    document.addEventListener("click", function () {
        const currentTime = Date.now();

        // Cooldown verhindert, dass bei zu schnellem Klicken zu viele Pokémon erzeugt werden
        if (currentTime - lastPokemonChaosTime < POKEMON_CHAOS_COOLDOWN) {
            return;
        }

        lastPokemonChaosTime = currentTime;
        void spawnAllFirstGenPokemon();
    });
}