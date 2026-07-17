// ===============================
// HTML-Elemente holen
// Speichert alle wichtigen Elemente der Berichtseite in Variablen,
// damit sie später mit gespeicherten Daten befüllt werden können.
// ===============================

const reportTrainerName = document.querySelector("#reportTrainerName");
const reportTrainerId = document.querySelector("#reportTrainerId");
const reportTrainerRegion = document.querySelector("#reportTrainerRegion");
const reportPokemonName = document.querySelector("#reportPokemonName");
const reportPokemonLevel = document.querySelector("#reportPokemonLevel");
const reportPokemonType = document.querySelector("#reportPokemonType");
const reportPokemonRisk = document.querySelector("#reportPokemonRisk");
const reportSecurityPokemon = document.querySelector("#reportSecurityPokemon");
const createReportButton = document.querySelector("#createReportButton");
const reportMessage = document.querySelector("#reportMessage");
const reportBox = document.querySelector("#reportBox");
const reportNumber = document.querySelector("#reportNumber");
const reportStatus = document.querySelector("#reportStatus");
const reportDecisionText = document.querySelector("#reportDecisionText");
const reportIncidentList = document.querySelector("#reportIncidentList");
const reportFinalProgress = document.querySelector("#reportFinalProgress");
const officialStamp = document.querySelector("#officialStamp");
const resetApplicationButton = document.querySelector("#resetApplicationButton");
const reportDossierPokemonImage = document.querySelector("#reportDossierPokemonImage");


// ===============================
// Bericht
// Erstellt den Abschlussbericht aus den gespeicherten Daten der vorherigen Seiten.
// ===============================

// Füllt die obere Berichtszusammenfassung mit Trainer-, Pokémon- und Prüfungsdaten
function showReportSummary() {
    if (reportTrainerName === null) {
        return;
    }

    reportTrainerName.textContent = getSavedValue("trainerName", "nicht vorhanden");
    reportTrainerId.textContent = getSavedValue("trainerId", "nicht vorhanden");
    reportTrainerRegion.textContent = formatRegion(getSavedValue("trainerRegion", ""));

    reportPokemonName.textContent = formatPokemonName(getSavedValue("selectedPokemonName", "nicht vorhanden"));
    reportPokemonLevel.textContent = getSavedValue("pokemonLevel", "nicht vorhanden");
    renderTypeBadges(reportPokemonType, formatPokemonTypes(sessionStorage.getItem("selectedPokemonTypes")));
    reportPokemonRisk.textContent = formatRisk(getSavedValue("pokemonRisk", ""));
    reportSecurityPokemon.textContent = sessionStorage.getItem("securityCheckDone") === "true" ? "bestanden" : "nicht abgeschlossen";

    updateReportPokemonImages();
}

// Erstellt eine zufällige Registrierungsnummer für den Abschlussbericht
function createReportNumber() {
    return "REG-" + getRandomNumber(100000, 999999) + "-KNT";
}

// Erstellt die Liste der amtlichen Zwischenfälle abhängig von gespeicherten Sitzungsdaten
function createIncidentTexts() {
    const incidents = [];
    const memeCount = Number(sessionStorage.getItem("memeCount") || "0");

    incidents.push("Pokémon wurde aus der Kanto-Datenbank ausgewählt und nicht per Dropdown geraten.");
    incidents.push("Trainerdaten wurden gespeichert, obwohl das Terminal Bedenken hatte.");

    // Zusätzlicher Hinweis, wenn der Bearbeitungsstand sehr niedrig war
    if (window.currentProgress <= 15) {
        incidents.push("Der Bearbeitungsstand näherte sich gefährlich dem Nullpunkt.");
    }

    // Zusätzlicher Hinweis, wenn der Bearbeitungsstand fast abgeschlossen war
    if (window.currentProgress >= 90) {
        incidents.push("Der Bearbeitungsstand war verdächtig nah an der Fertigstellung. Das wurde verhindert.");
    }

    // Wenn Meme-Overlays angezeigt wurden, wird die Anzahl im Bericht erwähnt
    if (memeCount > 0) {
        incidents.push("Während des Vorgangs traten " + memeCount + " amtliche Zwischenmeldungen auf.");
    }

    // Spezielle Meldung, wenn im Formular angegeben wurde, dass das Pokémon Formulare gefressen hat
    if (sessionStorage.getItem("formEaten") === "yes") {
        incidents.push("Das Pokémon hat bereits Formulare gefressen. Die Verwaltung ist informiert.");
    }

    // Fallback, damit immer genug Vorfälle im Bericht stehen
    if (incidents.length < 4) {
        incidents.push("Der Vorgang verlief überraschend normal. Dies wird intern untersucht.");
    }

    return incidents;
}

// Setzt das gespeicherte Pokémon-Bild im Berichtsdossier ein
function updateReportPokemonImages() {
    const spriteUrl = getSavedValue("selectedPokemonSprite", "");

    if (reportDossierPokemonImage !== null) {
        reportDossierPokemonImage.src = spriteUrl;
    }
}

// Rendert die automatisch erzeugten Zwischenfälle als Liste im Bericht
function renderIncidentList() {
    if (reportIncidentList === null) {
        return;
    }

    reportIncidentList.innerHTML = "";

    createIncidentTexts().forEach(function (incident) {
        const listItem = document.createElement("li");
        listItem.textContent = incident;
        reportIncidentList.appendChild(listItem);
    });
}

// Erstellt den Entscheidungstext des Abschlussberichts
function createReportDecisionText() {
    const pokemonName = formatPokemonName(getSavedValue("selectedPokemonName", "unbekannt"));
    const trainerName = getSavedValue("trainerName", "unbekannt");

    return "Das Pokémon " + pokemonName + " wurde dem Trainer " + trainerName + " zugeordnet. Diese Entscheidung ist digital wirksam, aber emotional fragwürdig.";
}

// Erstellt den finalen Bericht und zeigt den vorher versteckten Berichtbereich an
function createFinalReport() {
    if (reportBox === null) {
        return;
    }

    const newReportNumber = createReportNumber();
    sessionStorage.setItem("reportNumber", newReportNumber);
    sessionStorage.setItem("reportCreated", "true");

    reportNumber.textContent = newReportNumber;
    reportStatus.textContent = "Registrierung vorläufig bestätigt";
    reportDecisionText.textContent = createReportDecisionText();
    reportFinalProgress.textContent = window.currentProgress + "%";

    updateReportPokemonImages();
    renderIncidentList();

    officialStamp.textContent = "REGISTRIERT";
    reportBox.classList.remove("hidden");

    if (reportMessage !== null) {
        reportMessage.textContent = "Bericht erstellt. Bitte nicht zu ernst nehmen.";
    }

    setSystemMessage("Abschlussbericht erstellt. Das Terminal fühlt sich produktiv.");
}

// Stellt einen bereits erstellten Bericht wieder her, wenn die Seite neu geladen wurde
function restoreFinalReport() {
    if (reportBox === null || sessionStorage.getItem("reportCreated") !== "true") {
        return;
    }

    reportNumber.textContent = getSavedValue("reportNumber", "REG----");
    reportStatus.textContent = "Registrierung vorläufig bestätigt";
    reportDecisionText.textContent = "Dieser Bericht wurde aus gespeicherten Sitzungsdaten wiederhergestellt.";
    reportFinalProgress.textContent = window.currentProgress + "%";

    updateReportPokemonImages();
    renderIncidentList();

    reportBox.classList.remove("hidden");
}

// Löscht alle gespeicherten Daten und startet die Anwendung wieder auf der Startseite
function resetApplication() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

// Klick auf den Button erstellt den Abschlussbericht
if (createReportButton !== null) {
    createReportButton.addEventListener("click", createFinalReport);
}

// Klick auf den Reset-Button startet die Registrierung komplett neu
if (resetApplicationButton !== null) {
    resetApplicationButton.addEventListener("click", resetApplication);
}

// Beim Laden der Berichtseite werden Zusammenfassung und eventuell vorhandener Bericht angezeigt
showReportSummary();
restoreFinalReport();