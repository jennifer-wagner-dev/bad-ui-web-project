# 🎨 Bad UI – PokéMeldeamt

An intentionally frustrating multi-page web application built to explore JavaScript, API integration and user interaction by deliberately breaking common UX conventions.

The project was developed during my software development training at CODERS.BAY. The goal was to build a functional application while intentionally creating an unnecessarily complicated and chaotic user experience.

Behind the deliberately bad UX, the application uses structured JavaScript, dynamic DOM manipulation and data from an external REST API.

## 🚀 What the application does

PokéMeldeamt simulates an overly bureaucratic Pokémon registration process.

Users move through several steps of the registration workflow while the interface deliberately introduces confusing interactions and unexpected behaviour.

Features include:

- selecting Pokémon from the first generation
- retrieving Pokémon data from the external PokeAPI
- displaying Pokémon information dynamically
- a multi-page registration workflow
- storing progress and user data in the browser session
- dynamic forms and user interactions
- intentionally inconvenient UI behaviour
- animated background elements and cursor effects
- random visual and interaction effects
- a final registration report

## 🛠 Tech Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap
- REST APIs
- PokeAPI
- Browser Session Storage

## 🔌 API Integration

The project uses the public **PokeAPI** to retrieve data for the first 151 Pokémon.

The API layer handles tasks such as:

- asynchronous requests using `fetch()` and `async/await`
- checking HTTP responses
- handling failed requests
- converting larger API responses into smaller application-specific objects
- loading Pokémon names, IDs, sprites and types
- caching the Pokédex list during the current session

Example of the simplified data structure used inside the application:

```javascript
{
    id: 25,
    name: "pikachu",
    spriteUrl: "...",
    types: ["electric"]
}
```

## 🧩 JavaScript Structure

Instead of keeping all functionality in one script, the JavaScript is separated into files with different responsibilities:

```text
js/
├── api.js
├── backgroundPokemon.js
├── chaosEffects.js
├── cursorEffects.js
├── helpers.js
├── page.js
├── pagePokemon.js
├── pageReport.js
├── pageTest.js
└── pageTrainer.js
```

Examples:

- **api.js** – communication with the PokeAPI and data transformation
- **helpers.js** – shared utility functions and session data
- **page-specific scripts** – logic for individual steps of the registration process
- **chaosEffects.js** – deliberately inconvenient UI interactions
- **backgroundPokemon.js** – dynamic visual background behaviour
- **cursorEffects.js** – custom cursor interactions

## 💾 State Management

The application uses `sessionStorage` to keep information available while the user moves between the different pages of the registration process.

This allowed me to practise maintaining application state across multiple HTML documents without using a backend.

## 📁 Project Structure

```text
bad-ui-web-project/
├── html/
│   ├── index.html
│   ├── pokemon.html
│   ├── trainer.html
│   ├── pruefung.html
│   └── bericht.html
├── css/
│   ├── global.css
│   ├── layout.css
│   └── pokedex.css
├── js/
├── bootstrap/
├── fonts/
└── img/
```

## 🧠 What I Learned

This project gave me the opportunity to work on a larger frontend application where several pages and JavaScript modules need to work together.

A particularly useful part of the project was integrating an external REST API. I learned how to retrieve asynchronous data, handle unsuccessful requests and transform API responses into structures that are easier for the application to use.

I also gained more experience with DOM manipulation, event handling and maintaining data between pages using browser storage.

The unusual project requirement also made me think more consciously about usability. Deliberately designing inconvenient interactions made it easier to recognise why consistency, clear feedback and predictable behaviour are important in real applications.

## ▶️ Running the Project

1. Clone the repository:

```bash
git clone https://github.com/jennifer-wagner-dev/bad-ui-web-project.git
```

2. Open the repository.

3. Open:

```text
html/index.html
```

in a browser.

An internet connection is required for data loaded from the PokeAPI.

## ⚠️ About the UX

The confusing navigation, visual effects and inconvenient interactions are intentional.

This project was specifically designed as a **Bad UI exercise**. The goal was to create poor usability deliberately while keeping the underlying application functional.

In production software, I would of course aim for the exact opposite. 😄
