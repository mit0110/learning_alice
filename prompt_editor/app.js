/**
 * Prompt Editor for LLMs
 * Real-time prompt generation from input sections
 */

// DOM elements
const ideaGeneralInput = document.getElementById('idea-general');
const instruccionesInput = document.getElementById('instrucciones');
const detallesInput = document.getElementById('detalles');
const ejemplosInput = document.getElementById('ejemplos');
const promptOutputDiv = document.querySelector('.output-content');
const copyBtn = document.getElementById('copy-btn');

/**
 * Generate the formatted prompt from all input sections
 */
function generatePrompt() {
    const ideaGeneral = ideaGeneralInput.value.trim();
    const instrucciones = instruccionesInput.value.trim();
    const detalles = detallesInput.value.trim();
    const ejemplos = ejemplosInput.value.trim();

    let prompt = '';

    // Add each section with header if it has content
    if (ideaGeneral) {
        prompt += '# Idea General\n\n';
        prompt += ideaGeneral + '\n\n';
    }

    if (detalles) {
        prompt += '# Detalles\n\n';
        prompt += detalles + '\n\n';
    }

    if (ejemplos) {
        prompt += '# Ejemplos\n\n';
        prompt += ejemplos + '\n\n';
    }

    if (instrucciones) {
        prompt += '# Instrucciones\n\n';
        prompt += instrucciones + '\n\n';
    }

    // If all sections are empty, show placeholder
    if (!prompt) {
        prompt = 'Comienza a escribir en las secciones de la izquierda para generar tu prompt...';
    }

    return prompt;
}

/**
 * Update the prompt output display
 */
function updatePromptOutput() {
    const generatedPrompt = generatePrompt();
    promptOutputDiv.textContent = generatedPrompt;
}

/**
 * Copy the generated prompt to clipboard
 */
function copyPromptToClipboard() {
    const promptText = promptOutputDiv.textContent;

    // Use the Clipboard API
    navigator.clipboard.writeText(promptText).then(() => {
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copiado!';
        copyBtn.style.background = 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)';
        }, 2000);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Error al copiar al portapapeles');
    });
}

/**
 * Setup event listeners
 */
function init() {
    // Listen to input events on all textareas
    ideaGeneralInput.addEventListener('input', updatePromptOutput);
    instruccionesInput.addEventListener('input', updatePromptOutput);
    detallesInput.addEventListener('input', updatePromptOutput);
    ejemplosInput.addEventListener('input', updatePromptOutput);

    // Copy button
    copyBtn.addEventListener('click', copyPromptToClipboard);

    // Initial update to show pre-filled content
    updatePromptOutput();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
