// ===============================
// HTML-Elemente holen
// Speichert alle wichtigen Elemente der Trainerseite in Variablen,
// damit Pokémon-Zusammenfassung, Formular und Weiter-Link per JavaScript gesteuert werden können.
// ===============================

const trainerSelectedPokemonImage = document.querySelector("#trainerSelectedPokemonImage");
const trainerSelectedPokemonNumber = document.querySelector("#trainerSelectedPokemonNumber");
const trainerSelectedPokemonName = document.querySelector("#trainerSelectedPokemonName");
const trainerSelectedPokemonTypes = document.querySelector("#trainerSelectedPokemonTypes");

const trainerForm = document.querySelector("#trainerForm");
const trainerNameInput = document.querySelector("#trainerName");
const trainerIdInput = document.querySelector("#trainerId");
const trainerRegionInput = document.querySelector("#trainerRegion");
const contactCodeInput = document.querySelector("#contactCode");
const pokemonLevelInput = document.querySelector("#pokemonLevel");
const pokemonAddressInput = document.querySelector("#pokemonAddress");
const pokemonRiskInput = document.querySelector("#pokemonRisk");
const formEatenInput = document.querySelector("#formEaten");
const trainerFormMessage = document.querySelector("#trainerFormMessage");
const trainerNextLink = document.querySelector("#trainerNextLink");

// ===============================
// Trainerdaten
// Zeigt das ausgewählte Pokémon an, prüft das Formular und speichert die Eingaben.
// ===============================

// Stellt die Pokémon-Zusammenfassung aus der vorherigen Auswahlseite wieder her
function restoreSelectedPokemonSummaryForTrainer() {
    if (trainerSelectedPokemonImage === null) {
        return;
    }

    const selectedId = getSavedValue("selectedPokemonId", "---");
    const selectedName = getSavedValue("selectedPokemonName", "kein Pokémon");
    const selectedSprite = getSavedValue("selectedPokemonSprite", "");
    const selectedTypes = formatPokemonTypes(sessionStorage.getItem("selectedPokemonTypes"));

    trainerSelectedPokemonImage.src = selectedSprite;
    trainerSelectedPokemonNumber.textContent = selectedId === "---" ? "#---" : formatPokemonNumber(selectedId);
    trainerSelectedPokemonName.textContent = formatPokemonName(selectedName);
    renderTypeBadges(trainerSelectedPokemonTypes, selectedTypes);
}

// Füllt das Formular mit bereits gespeicherten Werten, falls die Seite neu geladen wurde
function restoreTrainerFormValues() {
    if (trainerForm === null) {
        return;
    }

    trainerNameInput.value = getSavedValue("trainerName", "");
    trainerIdInput.value = getSavedValue("trainerId", "");
    trainerRegionInput.value = getSavedValue("trainerRegion", "");
    contactCodeInput.value = getSavedValue("contactCode", "");
    pokemonLevelInput.value = getSavedValue("pokemonLevel", "");
    pokemonAddressInput.value = getSavedValue("pokemonAddress", "");
    pokemonRiskInput.value = getSavedValue("pokemonRisk", "");
    formEatenInput.value = getSavedValue("formEaten", "");

    updateTrainerNextLink();
}

// Entfernt alte Fehlermarkierungen und Fehlermeldungen aus dem Formular
function clearFormFieldErrors(formElement) {
    if (formElement === null) {
        return;
    }

    formElement.querySelectorAll(".form-field-error").forEach(function (field) {
        field.classList.remove("form-field-error");
    });

    formElement.querySelectorAll(".field-error-message").forEach(function (message) {
        message.remove();
    });
}

// Markiert ein einzelnes Formularfeld als ungültig und fügt eine Fehlermeldung darunter ein
function markFieldInvalid(inputElement, message) {
    if (inputElement === null) {
        return;
    }

    inputElement.classList.add("form-field-error");

    const errorMessage = document.createElement("div");
    errorMessage.classList.add("field-error-message");
    errorMessage.textContent = message;
    inputElement.insertAdjacentElement("afterend", errorMessage);
}

// Prüft eine einzelne Bedingung und markiert das Feld bei Fehlern
function validateField(condition, inputElement, message) {
    if (condition) {
        markFieldInvalid(inputElement, message);
        return true;
    }

    return false;
}

// Prüft alle Formularfelder und speichert die Daten bei gültiger Eingabe im sessionStorage
function saveTrainerData(event) {
    event.preventDefault();
    clearFormFieldErrors(trainerForm);

    let hasError = false;

    hasError = validateField(
        trainerNameInput.value.trim() === "",
        trainerNameInput,
        "Bitte Trainername eintragen."
    ) || hasError;

    hasError = validateField(
        trainerIdInput.value.trim().length < 5,
        trainerIdInput,
        "Die Trainer-ID braucht mindestens 5 Zeichen."
    ) || hasError;

    hasError = validateField(
        trainerRegionInput.value === "",
        trainerRegionInput,
        "Bitte Region auswählen."
    ) || hasError;

    hasError = validateField(
        contactCodeInput.value.trim() === "",
        contactCodeInput,
        "Bitte Kontaktcode eintragen."
    ) || hasError;

    hasError = validateField(
        pokemonLevelInput.value === "" ||
        Number(pokemonLevelInput.value) < 1 ||
        Number(pokemonLevelInput.value) > 100,
        pokemonLevelInput,
        "Bitte Level zwischen 1 und 100 eintragen."
    ) || hasError;

    hasError = validateField(
        pokemonAddressInput.value.trim() === "",
        pokemonAddressInput,
        "Bitte Aufenthaltsort eintragen."
    ) || hasError;

    hasError = validateField(
        pokemonRiskInput.value === "",
        pokemonRiskInput,
        "Bitte Gefährdungsstufe auswählen."
    ) || hasError;

    hasError = validateField(
        formEatenInput.value === "",
        formEatenInput,
        "Bitte Formularfraßverhalten auswählen."
    ) || hasError;

    // Bei Fehlern wird nichts gespeichert und der Benutzer bekommt eine Rückmeldung
    if (hasError) {
        trainerFormMessage.textContent = "Das Terminal verweigert die Speicherung. Einige Felder sind verdächtig leer.";
        setSystemMessage("Formularprüfung fehlgeschlagen. Bitte Eingabefelder beruhigen.");
        return;
    }

    // Speichert alle gültigen Formularwerte für die nächsten Seiten
    sessionStorage.setItem("trainerName", trainerNameInput.value.trim());
    sessionStorage.setItem("trainerId", trainerIdInput.value.trim());
    sessionStorage.setItem("trainerRegion", trainerRegionInput.value);
    sessionStorage.setItem("contactCode", contactCodeInput.value.trim());
    sessionStorage.setItem("pokemonLevel", pokemonLevelInput.value);
    sessionStorage.setItem("pokemonAddress", pokemonAddressInput.value.trim());
    sessionStorage.setItem("pokemonRisk", pokemonRiskInput.value);
    sessionStorage.setItem("formEaten", formEatenInput.value);
    sessionStorage.setItem("trainerDataSaved", "true");

    updateTrainerNextLink();

    trainerFormMessage.textContent = "Trainerdaten gespeichert. Das Terminal ist mittelmäßig zufrieden.";
    setSystemMessage("Trainerdaten gespeichert. Sicherheitsprüfung wurde widerwillig freigeschaltet.");
}

// Aktiviert oder deaktiviert den Weiter-Link zur Prüfungsseite
function updateTrainerNextLink() {
    if (trainerNextLink === null) {
        return;
    }

    if (sessionStorage.getItem("trainerDataSaved") === "true") {
        trainerNextLink.classList.remove("disabled");
    } else {
        trainerNextLink.classList.add("disabled");
    }
}

// Formular wird nicht normal abgeschickt, sondern per JavaScript geprüft und gespeichert
if (trainerForm !== null) {
    trainerForm.addEventListener("submit", saveTrainerData);
}

// Beim Laden der Seite werden Pokémon-Auswahl und gespeicherte Formularwerte wiederhergestellt
restoreSelectedPokemonSummaryForTrainer();
restoreTrainerFormValues();