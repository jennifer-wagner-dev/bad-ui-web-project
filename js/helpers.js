// ===============================
// Grundwerte und Hilfsfunktionen
// ===============================
// unabhängig von einer bestimmten Seite

// Holt den gespeicherten Bearbeitungsfortschritt aus der aktuellen Browser-Session
const savedProgress = sessionStorage.getItem("progress");
let progress;

// Wenn kein sinnvoller Fortschritt gespeichert ist, wird ein zufälliger Startwert gesetzt
if (savedProgress === null || Number(savedProgress) <= 0 || Number(savedProgress) >= 100) {
    progress = getRandomNumber(42, 78);
    sessionStorage.setItem("progress", String(progress));
} else {
    progress = Number(savedProgress);
}

// Macht den aktuellen Fortschritt global verfügbar, damit andere JavaScript-Dateien darauf zugreifen können
window.currentProgress = progress;

// Gibt eine zufällige ganze Zahl zwischen min und max zurück
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Wartet eine bestimmte Anzahl an Millisekunden und kann mit await verwendet werden
function wait(milliseconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, milliseconds);
    });
}

// Holt einen Wert aus sessionStorage oder gibt einen Ersatztext zurück, wenn nichts gespeichert ist
function getSavedValue(key, fallbackText) {
    const value = sessionStorage.getItem(key);

    if (value === null || value === "") {
        return fallbackText;
    }

    return value;
}

// Aktualisiert die Systemmeldung auf der aktuellen Seite
function setSystemMessage(message) {
    const systemMessage = document.querySelector("#systemMessage");

    if (systemMessage === null) {
        return;
    }

    // Entfernt ein bereits vorhandenes "SYSTEM:", damit es nicht doppelt angezeigt wird
    const cleanMessage = message.replace(/^SYSTEM:\s*/i, "");

    systemMessage.textContent = "SYSTEM:\n" + cleanMessage;
}

// Formatiert Pokémon-Namen lesbarer, z. B. aus "mr-mime" wird "Mr mime"
function formatPokemonName(name) {
    if (name === null || name === undefined || name === "") {
        return "Unbekannt";
    }

    return name.charAt(0).toUpperCase() + name.slice(1).replaceAll("-", " ");
}

// Formatiert Pokémon-Nummern im Pokédex-Stil, z. B. aus 25 wird "#025"
function formatPokemonNumber(id) {
    return "#" + String(id).padStart(3, "0");
}

// Wandelt gespeicherte Regionswerte in lesbare Namen um
function formatRegion(region) {
    const regions = {
        kanto: "Kanto",
        johto: "Johto",
        hoenn: "Hoenn",
        sinnoh: "Sinnoh",
        alola: "Alola"
    };

    return regions[region] || "nicht angegeben";
}

// Wandelt gespeicherte Risikowerte in lesbare deutsche Texte um
function formatRisk(risk) {
    const risks = {
        low: "niedrig",
        medium: "mittel",
        high: "hoch",
        unknown: "unklar"
    };

    return risks[risk] || "nicht angegeben";
}

// Wandelt einen gespeicherten Typen-String wieder in eine Liste um
function formatPokemonTypes(typesString) {
    if (typesString === null || typesString === undefined || typesString === "") {
        return [];
    }

    return typesString.split(",").filter(function (type) {
        return type.trim() !== "";
    });
}

// Erstellt die sichtbaren Typ-Badges für ein Pokémon
function renderTypeBadges(container, types) {
    if (container === null) {
        return;
    }

    // Vorherige Typ-Badges entfernen, damit beim Neuladen nichts doppelt angezeigt wird
    container.innerHTML = "";

    // Falls kein Typ vorhanden ist, wird ein unbekannter Typ angezeigt
    if (types.length === 0) {
        const badge = document.createElement("span");
        badge.classList.add("type-badge", "type-unknown");
        badge.textContent = "???";
        container.appendChild(badge);
        return;
    }

    // Für jeden Pokémon-Typ wird ein eigenes Badge erzeugt
    types.forEach(function (type) {
        const badge = document.createElement("span");
        badge.classList.add("type-badge", "type-" + type);
        badge.textContent = type;
        container.appendChild(badge);
    });
}