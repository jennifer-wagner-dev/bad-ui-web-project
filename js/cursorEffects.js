// Startet eine Cursor-Animation, bei der verschiedene Pokéball-Cursor nacheinander wechseln
function startPokeballCursorAnimation() {
    // CSS-Klassen für die verschiedenen Cursor-Bilder
    const cursorClasses = [
        "cursor-pokeball-1",
        "cursor-pokeball-2",
        "cursor-pokeball-3",
        "cursor-pokeball-4"
    ];

    // Merkt sich, welcher Cursor gerade aktiv ist
    let currentCursorIndex = 0;
    // documentElement ist das <html>-Element; dadurch gilt der Cursor für die gesamte Seite
    const pageElement = document.documentElement;

    // Setzt direkt den ersten Pokéball-Cursor beim Laden der Seite
    pageElement.classList.add(cursorClasses[currentCursorIndex]);

    // Wechselt alle 2 Sekunden zur nächsten Cursor-Klasse
    setInterval(function () {
        pageElement.classList.remove(cursorClasses[currentCursorIndex]);

        currentCursorIndex++;

        // Wenn der letzte Cursor erreicht wurde, beginnt die Animation wieder von vorne
        if (currentCursorIndex >= cursorClasses.length) {
            currentCursorIndex = 0;
        }

        pageElement.classList.add(cursorClasses[currentCursorIndex]);
    }, 1000);
}

// Aktiviert die Pokéball-Cursor-Animation
startPokeballCursorAnimation();