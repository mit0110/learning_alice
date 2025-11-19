/**
 * Random Words Generator
 * Picks one random word from each category
 */

// Word lists by category
const wordCategories = {
    tamaño: [
        "pequeño",
        "normal",
        "gigante",
        "cambia de forma",
        "flotante",
        "micro",
        "enorme"
    ],

    personalidad: [
        "tímido curioso",
        "dramático",
        "valiente distraído",
        "serio lógico",
        "caótico alegre",
        "educado nervioso",
        "soñador",
        "hiperactivo"
    ],

    apariencia: [
        "orejas animales",
        "ropa elegante",
        "colores cambiantes",
        "geometría",
        "accesorios vivos",
        "brillo mágico",
        "ojos gigantes"
    ],

    rareza: [
        "habla en rimas",
        "se ríe en momentos serios",
        "solo responde preguntas con acertijos",
        "cambia de idioma al azar",
        "olvida quién es cada 5 minutos",
        "cree que todos son insectos",
        "solo come cosas invisibles"
    ]
};

// DOM elements
const randomBtn = document.getElementById('random-btn');
const selectedWordsDiv = document.getElementById('selected-words');

/**
 * Display all words in their respective lists
 */
function displayWordLists() {
    // Iterate through all categories and display their words
    Object.entries(wordCategories).forEach(([categoryKey, words]) => {
        const listElement = document.getElementById(`${categoryKey}-list`);

        if (listElement) {
            words.forEach(word => {
                const tag = document.createElement('span');
                tag.className = 'word-tag';
                tag.textContent = word;
                listElement.appendChild(tag);
            });
        }
    });
}

/**
 * Get a random word from an array
 */
function getRandomWord(wordsArray) {
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    return wordsArray[randomIndex];
}

/**
 * Capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Pick random words from each category and display them
 */
function pickRandomWords() {
    // Clear the selected words div
    selectedWordsDiv.innerHTML = '';

    // Pick one random word from each category
    Object.entries(wordCategories).forEach(([categoryKey, words]) => {
        const selectedWord = getRandomWord(words);
        const displayName = capitalizeFirstLetter(categoryKey);

        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
            <h4>${displayName}</h4>
            <p>${selectedWord}</p>
        `;
        selectedWordsDiv.appendChild(item);
    });
}

/**
 * Initialize the app
 */
function init() {
    displayWordLists();
    randomBtn.addEventListener('click', pickRandomWords);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
