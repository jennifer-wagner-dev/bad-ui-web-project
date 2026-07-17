// ===============================
// HTML-Elemente holen
// Speichert alle wichtigen Elemente der Prüfungsseite in Variablen,
// damit sie während der Sicherheitsprüfung verändert werden können.
// ===============================

const startSecurityCheckButton = document.querySelector("#startSecurityCheckButton");
const securityProtocolBox = document.querySelector("#securityProtocolBox");
const securityProtocolList = document.querySelector("#securityProtocolList");
const securityResultBox = document.querySelector("#securityResultBox");
const securityPokemonImage = document.querySelector("#securityPokemonImage");
const securityPokemonName = document.querySelector("#securityPokemonName");
const securityPokemonId = document.querySelector("#securityPokemonId");
const securityPokemonStatus = document.querySelector("#securityPokemonStatus");
const securityConfirmCheck = document.querySelector("#securityConfirmCheck");
const finishSecurityCheckButton = document.querySelector("#finishSecurityCheckButton");
const securityMessage = document.querySelector("#securityMessage");
const securityNextLink = document.querySelector("#securityNextLink");

// ===============================
// Sicherheitsprüfung
// Simuliert eine unnötig lange Prüfung mit Schreibeffekt,
// Prüfprotokoll und Freischaltung des Berichts.
// ===============================

// Blendet das Prüfprotokoll ein und leert alte Einträge
function resetSecurityProtocol() {
    if (securityProtocolBox === null || securityProtocolList === null) {
        return;
    }

    securityProtocolBox.classList.remove("hidden");
    securityProtocolList.innerHTML = "";
}

// Schreibt Text Zeichen für Zeichen in ein Element
async function typeText(element, text, speed) {
    if (element === null) {
        return;
    }

    element.textContent = "";

    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await wait(speed);
    }
}

// Gibt eine Systemmeldung mit Schreibeffekt aus
async function typeSystemMessage(message) {
    const systemMessage = document.querySelector("#systemMessage");

    if (systemMessage === null) {
        return;
    }

    await typeText(systemMessage, "SYSTEM:\n" + message, 35);
}

// Fügt dem Prüfprotokoll einen neuen Eintrag hinzu und markiert ihn danach als erledigt
async function addSecurityProtocolEntry(message) {
    if (securityProtocolList === null) {
        return;
    }

    const listItem = document.createElement("li");
    securityProtocolList.appendChild(listItem);

    await typeText(listItem, message, 35);

    listItem.classList.add("done");
}

// Stellt das Prüfungsbildschirm-Panel aus gespeicherten Pokémon-Daten wieder her
function restoreSecurityScreen() {
    if (securityPokemonImage === null) {
        return;
    }

    const sprite = getSavedValue("selectedPokemonSprite", "");
    const id = getSavedValue("selectedPokemonId", "---");
    const name = getSavedValue("selectedPokemonName", "Noch nicht geprüft");

    securityPokemonImage.src = sprite;
    securityPokemonId.textContent = id === "---" ? "#---" : formatPokemonNumber(id);
    securityPokemonName.textContent = formatPokemonName(name);

    // Wenn die Prüfung schon abgeschlossen wurde, wird der Ergebnisbereich direkt wieder angezeigt
    if (sessionStorage.getItem("securityCheckDone") === "true") {
        securityPokemonStatus.textContent = "Status: registrierbar, aber verdächtig";
        securityResultBox.classList.remove("hidden");
        securityConfirmCheck.checked = true;
        finishSecurityCheckButton.disabled = true;
        updateSecurityNextLink();
    }
}

// Startet die simulierte Sicherheitsprüfung
async function startSecurityCheck() {
    if (startSecurityCheckButton === null) {
        return;
    }

    // Button während der Prüfung sperren, damit die Prüfung nicht mehrfach gleichzeitig startet
    startSecurityCheckButton.disabled = true;
    startSecurityCheckButton.textContent = "Prüfung läuft...";

    resetSecurityProtocol();

    // Ergebnisbereich und Checkbox werden für einen neuen Prüflauf zurückgesetzt
    if (securityResultBox !== null) {
        securityResultBox.classList.add("hidden");
    }

    if (securityConfirmCheck !== null) {
        securityConfirmCheck.checked = false;
    }

    if (finishSecurityCheckButton !== null) {
        finishSecurityCheckButton.disabled = true;
    }

    if (securityMessage !== null) {
        securityMessage.textContent = "";
    }
// Codebeispiel
    // Ab hier läuft die Prüfung absichtlich langsam mit Wartezeiten und Protokolleinträgen ab
    await typeSystemMessage("Prüfung gestartet. Bitte warten. Das System sucht einen freien Sachbearbeiter.");

    await wait(2000);

    await typeSystemMessage("Pokédex-Datensatz wird geöffnet. Bitte nicht ungeduldig werden.");
    await wait(1000);
    await addSecurityProtocolEntry("Pokédex-Datensatz wird geöffnet.");

    await wait(2000);

    await typeSystemMessage("Trainer-ID wird mit alten Akten abgeglichen.");
    await wait(1000);
    await addSecurityProtocolEntry("Trainer-ID wird mit unklarem Ergebnis verglichen.");

    await wait(2000);

    await typeSystemMessage("Gefährdungsstufe wird geprüft. Das System übertreibt vorsichtshalber.");
    await wait(1000);
    await addSecurityProtocolEntry("Gefährdungsstufe wird absichtlich überinterpretiert.");

    await wait(2000);

    await typeSystemMessage("Formularfraßverhalten wird amtlich bewertet.");
    await wait(1000);
    await addSecurityProtocolEntry("Formularfraßverhalten wurde als Charaktereigenschaft gewertet.");

    await wait(2000);

    await typeSystemMessage("Abschlussstempel wird gesucht. Bitte warten Sie unnötig weiter.");
    await wait(1000);
    await addSecurityProtocolEntry("Abschlussstempel wurde gefunden.");

    await wait(2000);

    // Nach Abschluss wird der Ergebnisbereich sichtbar
    securityPokemonStatus.textContent = "Status: Prüfung abgeschlossen, Ergebnis halb plausibel";
    securityResultBox.classList.remove("hidden");

    await typeSystemMessage("Sicherheitsprüfung abgeschlossen. Bitte bestätigen Sie Ihre Verwirrung.");

    // Prüfung kann erneut gestartet werden
    startSecurityCheckButton.disabled = false;
    startSecurityCheckButton.textContent = "Prüfung erneut starten";

    updateSecurityFinishButton();
}

// Aktiviert den Abschluss-Button nur, wenn die Checkbox angehakt wurde
function updateSecurityFinishButton() {
    if (finishSecurityCheckButton === null || securityConfirmCheck === null) {
        return;
    }

    finishSecurityCheckButton.disabled = !securityConfirmCheck.checked;
}

// Speichert die abgeschlossene Prüfung und schaltet den Link zum Bericht frei
function finishSecurityCheck() {
    sessionStorage.setItem("securityCheckDone", "true");
    updateSecurityNextLink();

    if (securityMessage !== null) {
        securityMessage.textContent = "Prüfung abgeschlossen. Der Bericht kann erstellt werden.";
    }

    setSystemMessage("Sicherheitsprüfung abgeschlossen. Bericht wurde freigeschaltet.");
}

// Aktiviert oder deaktiviert den Weiter-Link zur Berichtseite
function updateSecurityNextLink() {
    if (securityNextLink === null) {
        return;
    }

    if (sessionStorage.getItem("securityCheckDone") === "true") {
        securityNextLink.classList.remove("disabled");
    } else {
        securityNextLink.classList.add("disabled");
    }
}

// Klick auf den Startbutton beginnt die simulierte Prüfung
if (startSecurityCheckButton !== null) {
    startSecurityCheckButton.addEventListener("click", startSecurityCheck);
}

// Änderung der Checkbox prüft, ob der Abschlussbutton freigeschaltet werden darf
if (securityConfirmCheck !== null) {
    securityConfirmCheck.addEventListener("change", updateSecurityFinishButton);
}

// Klick auf den Abschlussbutton speichert die erfolgreiche Prüfung
if (finishSecurityCheckButton !== null) {
    finishSecurityCheckButton.addEventListener("click", finishSecurityCheck);
}

// Beim Laden der Seite werden gespeicherte Prüfungsdaten wiederhergestellt
restoreSecurityScreen();
updateSecurityNextLink();