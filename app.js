/**
 * Alice in Wonderland Word Prediction Game
 * Interactive learning app for 5th-6th grade students
 * Uses reinforcement learning concepts to teach word prediction
 */

// Phrases loaded from JSON file
let phrases = [];
let feedbackPhrases = {};

// Game state
let currentPhraseIndex = 0;
let currentPhrase = null;
let previousScore = 0.3; // Starting score

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
 * Load feedback phrases from JSON file
 */
async function loadFeedback() {
    try {
        const response = await fetch('feedback.json');
        const data = await response.json();
        feedbackPhrases = data;
    } catch (error) {
        console.error('Error loading feedback:', error);
        // Fallback to empty object if loading fails
        feedbackPhrases = {
            big_increase: [],
            small_change: [],
            big_decrease: []
        };
    }
}

/**
 * Initialize the game
 */
async function init() {
    await loadPhrases();
    await loadFeedback();
    updateProgressBar(previousScore); // Set initial progress bar position
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

    // Clear input
    wordInput.value = '';
    wordInput.focus();

    // Fade out the score display (if there is content)
    if (scoreDisplay.textContent.trim() !== '') {
        scoreDisplay.classList.add('fade-out');

        // After fade completes, clear the score and remove fade class
        setTimeout(() => {
            scoreDisplay.textContent = '';
            scoreDisplay.classList.remove('fade-out');
            scoreDisplay.style.opacity = '1'; // Reset opacity
        }, 2000);
    }
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

    // Get score delta (change)
    const delta = calculateScore(userAnswer);

    // Calculate new score by adding delta to previous score
    let newScore = previousScore + delta;

    // Clamp score between 0 and 1
    newScore = Math.max(0, Math.min(1, newScore));

    // Display the score (displayScore handles previousScore update internally)
    displayScore(newScore);

    // Update progress bar
    updateProgressBar(newScore);

    // Move to next phrase after a longer delay (kids need time to read)
    setTimeout(() => {
        moveToNextPhrase();
    }, 5000);
}

/**
 * Calculate simple similarity between user answer and target words
 * Uses character overlap and length similarity
 *
 * @param {string} userAnswer - The word entered by the student
 * @param {Array<string>} targetWords - List of words to compare against
 * @returns {number} Score between 0 and 0.5 (scaled for partial credit)
 */
function calculateSimpleSimilarity(userAnswer, targetWords) {
    let bestScore = 0;

    for (let target of targetWords) {
        const user = userAnswer.toLowerCase();
        const targ = target.toLowerCase();

        // Count matching characters
        const userChars = new Set(user);
        const targChars = new Set(targ);
        const overlap = [...userChars].filter(c => targChars.has(c)).length;
        const maxChars = Math.max(userChars.size, targChars.size);
        const charScore = maxChars > 0 ? overlap / maxChars : 0;

        // Length similarity (closer to 1 = more similar)
        const lengthScore = 1 - Math.abs(user.length - targ.length) / Math.max(user.length, targ.length);

        // Average the scores and scale to max 0.5
        const score = (charScore * 0.6 + lengthScore * 0.4) * 0.5;

        bestScore = Math.max(bestScore, score);
    }

    return bestScore;
}

/**
 * Calculate score delta (change) based on user answer
 * Returns how much to add/subtract from current score
 *
 * @param {string} userAnswer - The word entered by the student
 * @returns {number} Delta to add to current score
 */
function calculateScore(userAnswer) {
    // Normalize the user answer (lowercase, trim)
    const normalizedAnswer = userAnswer.toLowerCase().trim();

    // Check if it's in correct_words -> random increase between 0.07 and 0.15
    const correctWords = currentPhrase.correct_words.map(w => w.toLowerCase());
    if (correctWords.includes(normalizedAnswer)) {
        const delta = 0.07 + Math.random() * 0.08; // Random between 0.07 and 0.15
        console.log(`User answer: "${userAnswer}" - CORRECT! Delta: +${delta.toFixed(3)}`);
        return delta;
    }

    // Check if it's in kinda_ok_words -> random change between -0.05 and 0.05
    const kindaOkWords = currentPhrase.kinda_ok_words.map(w => w.toLowerCase());
    if (kindaOkWords.includes(normalizedAnswer)) {
        const delta = -0.05 + Math.random() * 0.10; // Random between -0.05 and 0.05
        console.log(`User answer: "${userAnswer}" - KINDA OK. Delta: ${delta.toFixed(3)}`);
        return delta;
    }

    // Not in either list, calculate similarity-based delta
    const allTargetWords = [...currentPhrase.correct_words, ...currentPhrase.kinda_ok_words];
    const similarityScore = calculateSimpleSimilarity(userAnswer, allTargetWords);

    // Convert similarity to delta: can be very negative, but capped at +0.05
    let delta = similarityScore - 0.4;
    if (delta > 0.05) {
        delta = 0.05;
    }

    console.log(`User answer: "${userAnswer}" - Wrong. Similarity: ${similarityScore.toFixed(2)}, Delta: ${delta.toFixed(3)}`);
    return delta;
}

/**
 * Get a random feedback phrase based on score change
 *
 * @param {number} change - Change in score (between -1 and 1)
 * @returns {string} Random feedback phrase
 */
function getFeedbackPhrase(change) {
    let phraseList = [];

    if (change > 0.10) {
        phraseList = feedbackPhrases.big_increase || [];
    } else if (change < -0.10) {
        phraseList = feedbackPhrases.big_decrease || [];
    } else {
        phraseList = feedbackPhrases.small_change || [];
    }

    // Return random phrase from the list
    if (phraseList.length > 0) {
        const randomIndex = Math.floor(Math.random() * phraseList.length);
        return phraseList[randomIndex];
    }

    return '';
}

/**
 * Display the score to the user
 *
 * @param {number} score - Score between 0 and 1
 */
function displayScore(score) {
    const change = score - previousScore;

    // Format the change with + or - sign (using decimals for precision)
    const changePercent = (change * 100).toFixed(1);
    let changeText = '';
    if (change > 0) {
        changeText = `+${changePercent}%`;
    } else if (change < 0) {
        changeText = `${changePercent}%`;
    } else {
        changeText = '0.0%';
    }

    // Get appropriate feedback phrase
    const feedbackText = getFeedbackPhrase(change);

    // Display score change and feedback
    scoreDisplay.innerHTML = `Puntuación: ${changeText}<br><small style="font-size: 0.8em;">${feedbackText}</small>`;

    // Update previous score for next time
    previousScore = score;

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
