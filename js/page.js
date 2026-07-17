// ===============================
// Globaler Neustart-Button
// Erstellt auf jeder Seite einen Button, mit dem die gesamte Registrierung zurückgesetzt wird.
// ===============================

// Erstellt den festen Neustart-Button oben rechts auf der Seite
function createRestartApplicationButton() {
    // Verhindert, dass der Button mehrfach erzeugt wird
    if (document.querySelector("#restartApplicationButton") !== null) {
        return;
    }

    const restartButton = document.createElement("button");

    restartButton.id = "restartApplicationButton";
    restartButton.classList.add("restart-application-button");
    restartButton.type = "button";
    restartButton.textContent = "Neu starten";

    // Beim Klick wird nach Bestätigung die komplette Session zurückgesetzt
    restartButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const userConfirmed = confirm(
            "Möchtest du den Antrag wirklich komplett neu starten? Alle gespeicherten Pokédex- und Registrierungsdaten werden gelöscht."
        );

        // Wenn der Benutzer abbricht, passiert nichts
        if (!userConfirmed) {
            return;
        }

        // Löscht alle gespeicherten Daten dieser Browser-Session und springt zurück zur Startseite
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    document.body.appendChild(restartButton);
}

// ===============================
// Zugriffsschutz
// Verhindert, dass Seiten übersprungen werden, wenn vorherige Schritte noch nicht erledigt wurden.
// ===============================

// Ermittelt den Dateinamen der aktuellen Seite, z. B. "trainer.html" oder "bericht.html"
function getCurrentPageName() {
    const pathParts = window.location.pathname.split("/");
    const pageName = pathParts[pathParts.length - 1];
    return pageName === "" ? "index.html" : pageName;
}

// Zeigt eine Sperrmeldung an und leitet danach automatisch auf die passende Seite zurück
function showAccessDeniedAndRedirect(message, targetPage) {
    const overlay = document.createElement("div");
    overlay.classList.add("access-denied-overlay");

    const box = document.createElement("div");
    box.classList.add("access-denied-box");

    const label = document.createElement("div");
    label.classList.add("access-denied-label");
    label.textContent = "Zugriff gesperrt";

    const messageParagraph = document.createElement("p");
    messageParagraph.classList.add("access-denied-message");
    messageParagraph.textContent = message;

    const hint = document.createElement("p");
    hint.classList.add("access-denied-hint");
    hint.textContent = "Du wirst zurückgeleitet.";

    box.appendChild(label);
    box.appendChild(messageParagraph);
    box.appendChild(hint);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Nach kurzer Wartezeit wird der Benutzer zur erforderlichen Seite zurückgeleitet
    setTimeout(function () {
        window.location.href = targetPage;
    }, 1600);
}
// Codebeispiel
// Prüft anhand gespeicherter sessionStorage-Werte, ob die aktuelle Seite betreten werden darf
function checkPageAccess() {
    const currentPage = getCurrentPageName();
    const pokemonSelected = sessionStorage.getItem("selectedPokemonSelected") === "true";
    const trainerDataSaved = sessionStorage.getItem("trainerDataSaved") === "true";
    const securityCheckDone = sessionStorage.getItem("securityCheckDone") === "true";

    // Formularseite darf nur geöffnet werden, wenn vorher ein Pokémon ausgewählt wurde
    if (currentPage === "trainer.html" && !pokemonSelected) {
        showAccessDeniedAndRedirect(
            "Bitte wähle zuerst ein Pokémon im Pokédex aus.",
            "pokemon.html"
        );
        return;
    }

    // Prüfungsseite darf nur geöffnet werden, wenn Pokémon-Auswahl und Formular abgeschlossen sind
    if (currentPage === "pruefung.html" && (!pokemonSelected || !trainerDataSaved)) {
        showAccessDeniedAndRedirect(
            "Bitte wähle zuerst ein Pokémon aus und speichere danach die Registrierungsdaten.",
            "trainer.html"
        );
        return;
    }

    // Berichtseite darf nur geöffnet werden, wenn die Prüfung abgeschlossen wurde
    if (currentPage === "bericht.html" && !securityCheckDone) {
        showAccessDeniedAndRedirect(
            "Bitte schließe zuerst die Prüfung ab.",
            "pruefung.html"
        );
    }
}

// ===============================
// Seitenwechsel-Ladeanzeige
// Zeigt vor dem Wechsel auf eine andere HTML-Seite kurz ein Lade-Overlay an.
// ===============================

// Erstellt ein Lade-Overlay und wechselt danach zur Zielseite
function showPageLoadingAndGo(targetUrl) {
    const overlay = document.createElement("div");
    overlay.classList.add("page-loading-overlay");

    const box = document.createElement("div");
    box.classList.add("page-loading-box");

    const title = document.createElement("div");
    title.classList.add("page-loading-title");
    title.textContent = "Pokédex lädt";

    const text = document.createElement("p");
    text.classList.add("page-loading-text");
    text.textContent = "Bitte warten, während das Terminal so tut, als wäre es beschäftigt.";

    const bar = document.createElement("div");
    bar.classList.add("page-loading-bar");

    const barInner = document.createElement("div");
    barInner.classList.add("page-loading-bar-inner");

    bar.appendChild(barInner);
    box.appendChild(title);
    box.appendChild(text);
    box.appendChild(bar);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

// Der eigentliche Seitenwechsel passiert verzögert, damit die Ladeanimation sichtbar ist
    setTimeout(function () {
        window.location.href = targetUrl;
    }, 1600);
}

// Fängt Klicks auf interne HTML-Links ab und ersetzt den direkten Wechsel durch die Ladeanzeige
function initializePageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (link.classList.contains("disabled") || event.defaultPrevented) {
                return;
            }

            event.preventDefault();
            showPageLoadingAndGo(link.getAttribute("href"));
        });
    });
}

// ===============================
// Gemeinsame Initialisierung für jede Seite
// Startet alle seitenübergreifenden Funktionen des Projekts.
// ===============================

// Aktiviert Hintergrund-Pokémon, Klick-Chaos, Neustart-Button, Meme-Overlays, Zugriffsschutz und Seitenübergänge
function initCommonUI() {
    initializeAmbientPokemonBackground();
    activatePokemonClickChaos();
    createRestartApplicationButton();
    startMemeOverlayTimer();
    checkPageAccess();
    initializePageTransitions();
}

// Startet die gemeinsame Initialisierung automatisch beim Laden der Datei
initCommonUI();