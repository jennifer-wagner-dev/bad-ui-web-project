# 🎨 Bad UI – PokéMeldeamt

My first frontend project, developed during my software development training at CODERS.BAY.

PokéMeldeamt is an intentionally frustrating multi-page web application that simulates an overly bureaucratic Pokémon registration process.

The challenge was to develop a functional application while deliberately breaking common UX conventions.

Behind the chaotic interface, the application uses structured JavaScript, dynamic DOM manipulation, browser storage and external API integration.

🌐 **[Try the Live Demo](https://jennifer-wagner-dev.github.io/bad-ui-web-project/)**

> The unconventional design and inconvenient interactions are intentional and part of the Bad UI exercise.

## 🚀 Features

- Selection of Pokémon from the first generation
- Integration of the external PokéAPI
- Dynamic presentation of Pokémon information
- Multi-page registration workflow
- Browser-based session management
- Dynamic forms and event handling
- Animated backgrounds and cursor effects
- Random visual and interaction effects
- Generation of a final registration report

## 🛠 Technologies & Concepts

- HTML5
- CSS3
- JavaScript
- Bootstrap
- REST APIs
- PokéAPI
- Fetch API
- Promises and async/await
- DOM manipulation
- Event handling
- Browser Session Storage

## 🔌 API Integration

The application retrieves data for the first 151 Pokémon through the public PokéAPI.

The API layer is responsible for:

- Sending asynchronous HTTP requests using `fetch()`
- Processing responses with `async/await`
- Checking HTTP response status
- Handling unsuccessful requests
- Transforming API responses into application-specific data structures
- Retrieving Pokémon names, IDs, sprites and types
- Caching the Pokédex list during the current session

Example of a simplified Pokémon data structure used within the application:

```javascript
{
    id: 25,
    name: "pikachu",
    spriteUrl: "...",
    types: ["electric"]
}
```

## 🧩 JavaScript Architecture

The JavaScript functionality is separated into multiple files with dedicated responsibilities.

| File | Responsibility |
| --- | --- |
| `api.js` | API communication and data transformation |
| `helpers.js` | Shared utility functions and session data |
| `pagePokemon.js` | Pokémon selection workflow |
| `pageTrainer.js` | Trainer registration |
| `pageTest.js` | Registration test |
| `pageReport.js` | Final registration report |
| `chaosEffects.js` | Intentionally inconvenient interactions |
| `backgroundPokemon.js` | Dynamic background effects |
| `cursorEffects.js` | Custom cursor interactions |

This structure helped me organise JavaScript functionality across multiple pages instead of placing all application logic in a single script.

## 💾 State Management

The application uses `sessionStorage` to maintain registration data while users navigate between different HTML pages.

This enabled me to practise managing application state across multiple documents without requiring a backend or database.

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
│   ├── api.js
│   ├── backgroundPokemon.js
│   ├── chaosEffects.js
│   ├── cursorEffects.js
│   ├── helpers.js
│   ├── page.js
│   ├── pagePokemon.js
│   ├── pageReport.js
│   ├── pageTest.js
│   └── pageTrainer.js
├── bootstrap/
├── fonts/
└── img/
```

## 🧠 What I Learned

As my first frontend project, PokéMeldeamt allowed me to apply fundamental web development concepts in a complete, interactive application.

Through this project, I gained practical experience in:

- Structuring multi-page web applications
- Integrating external REST APIs
- Working with asynchronous JavaScript
- Handling API responses and errors
- Dynamically manipulating the DOM
- Implementing event-driven interactions
- Managing application state through browser storage
- Separating JavaScript functionality into reusable files

The unusual project requirement also strengthened my understanding of usability.

Deliberately breaking UX conventions helped me recognise the importance of consistency, clear feedback and predictable behaviour in real-world applications.

## ▶️ Running the Project

Clone the repository:

```bash
git clone https://github.com/jennifer-wagner-dev/bad-ui-web-project.git
cd bad-ui-web-project
```

Open `html/index.html` in a browser.

An internet connection is required to retrieve Pokémon data from the external API.

## ⚠️ About the UX

The confusing navigation, visual effects and inconvenient interactions are deliberate.

This project was specifically designed as a Bad UI exercise. The objective was to explore frontend development while intentionally creating poor usability.

In production software, I would of course aim for the exact opposite. 😄
