/**
 * Alice in Wonderland Word Prediction Game
 * Interactive learning app for 5th-6th grade students
 * Uses reinforcement learning concepts to teach word prediction
 */

// Phrases loaded from JSON file
let phrases = [];

// Game state
let currentPhraseIndex = 0;
let currentPhrase = null;

// DOM elements
const phraseDisplay = document.getElementById('phrase-display');
const wordInput = document.getElementById('word-input');
const submitBtn = document.getElementById('submit-btn');
const scoreDisplay = document.getElementById('score-display');
const progressIndicator = document.getElementById('progress-indicator');
const progressFill = document.getElementById('progress-fill');

/**
 * Load phrases from JSON file
 */
async function loadPhrases() {
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        phrases = data;
    } catch (error) {
        console.error('Error loading phrases:', error);
        // Fallback to empty array if loading fails
        phrases = [];
    }
}

/**
 * Initialize the game
 */
async function init() {
    await loadPhrases();
    loadNewPhrase();
    setupEventListeners();
}

/**
 * Setup event listeners for user interactions
 */
function setupEventListeners() {
    // Submit button click
    submitBtn.addEventListener('click', handleSubmit);

    // Enter key in input field
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
}

/**
 * Load a new phrase for the student to guess
 */
function loadNewPhrase() {
    // Get current phrase
    currentPhrase = phrases[currentPhraseIndex];

    // Format the question with the hidden word placeholder
    const formattedText = currentPhrase.question.replace('_____', "<span class='hidden-word'>_____</span>");

    // Display the phrase
    phraseDisplay.innerHTML = formattedText;

    // Clear input and score
    wordInput.value = '';
    scoreDisplay.textContent = '';
    wordInput.focus();

    // Reset progress indicator to start position
    updateProgressBar(0);
}

/**
 * Handle submission of student's guess
 */
function handleSubmit() {
    const userAnswer = wordInput.value.trim();

    // Validate input
    if (userAnswer === '') {
        scoreDisplay.textContent = '¡Por favor escriban una palabra!';
        return;
    }

    // Get similarity score
    const score = calculateScore(userAnswer);

    // Display the score
    displayScore(score);

    // Update progress bar
    updateProgressBar(score);

    // Move to next phrase after a short delay
    setTimeout(() => {
        moveToNextPhrase();
    }, 2000);
}

/**
 * Calculate similarity score between user answer and correct answer
 * Checks against correct_words and kinda_ok_words lists
 *
 * @param {string} userAnswer - The word entered by the student
 * @returns {number} Score between 0 and 1 (0 = completely wrong, 1 = perfect match)
 */
function calculateScore(userAnswer) {
    // Normalize the user answer (lowercase, trim)
    const normalizedAnswer = userAnswer.toLowerCase().trim();

    // Check if it's in correct_words (score = 1.0)
    const correctWords = currentPhrase.correct_words.map(w => w.toLowerCase());
    if (correctWords.includes(normalizedAnswer)) {
        console.log(`User answer: "${userAnswer}" - CORRECT!`);
        return 1.0;
    }

    // Check if it's in kinda_ok_words (score = 0.7)
    const kindaOkWords = currentPhrase.kinda_ok_words.map(w => w.toLowerCase());
    if (kindaOkWords.includes(normalizedAnswer)) {
        console.log(`User answer: "${userAnswer}" - KINDA OK`);
        return 0.7;
    }

    // Not in either list, return random score for now
    // TODO: Implement Levenshtein distance or semantic similarity
    const randomScore = Math.random() * 0.5; // Random between 0 and 0.5
    console.log(`User answer: "${userAnswer}" - Not in lists, random score: ${randomScore.toFixed(2)}`);

    return randomScore;
}

/**
 * Display the score to the user
 *
 * @param {number} score - Score between 0 and 1
 */
function displayScore(score) {
    const percentage = Math.round(score * 100);
    scoreDisplay.textContent = `Puntuación: ${percentage}%`;

    // Add animation
    scoreDisplay.style.animation = 'none';
    setTimeout(() => {
        scoreDisplay.style.animation = 'pulse 0.5s ease';
    }, 10);
}

/**
 * Update the progress bar based on the score
 *
 * @param {number} score - Score between 0 and 1
 */
function updateProgressBar(score) {
    // Convert score to percentage
    const percentage = score * 100;

    // Update indicator position
    progressIndicator.style.left = `${percentage}%`;

    // Update fill width (optional visual enhancement)
    progressFill.style.width = `${percentage}%`;
}

/**
 * Move to the next phrase in the sequence
 */
function moveToNextPhrase() {
    // Increment phrase index (loop back to start if at the end)
    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;

    // Load the new phrase
    loadNewPhrase();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', init);
