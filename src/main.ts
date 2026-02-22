import { MODEL_URL, GEMMA_FILENAME } from "./model-details";
import { updateStatus } from "./utils";
import { COLOR_ERROR_RED, COLOR_PROGRESS_PURPLE, COLOR_SUCCESS_GREEN } from "./colors";

import { updateStorageDisplay, checkPresence, fetchFullGemma, deleteGemma } from "./model-storage";
import { clickBubble } from "./chat";

// In main.ts
async function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        // We point to the bundled file in the root of the deployment
        await navigator.serviceWorker.register('./serviceWorker.js');
        
        // CRUCIAL: Wait for the worker to be ready to intercept
        await navigator.serviceWorker.ready;

        // OPTIONAL BUT RECOMMENDED: Force immediate control
        if (navigator.serviceWorker.controller) {
            console.log("Worker is already controlling the page.");
        } else {
            console.log("Reloading to let Worker take control...");
            window.location.reload(); 
        }
    }
}

initializeServiceWorker()

// js/main.js
console.log("LLLM: Logic initialized.");

document.addEventListener('DOMContentLoaded', () => {
    setupUIListenerButtons()

    updateStorageDisplay();
    checkPresence();
    // initMentor()
});

function setupUIListenerButtons() {
    const downloadButton = document.getElementById('btn-download') as HTMLButtonElement;
    downloadButton?.addEventListener('click', fetchFullGemma);
    const deleteButton = document.getElementById('btn-delete') as HTMLButtonElement;
    deleteButton?.addEventListener('click', deleteGemma);

    const bubble = document.getElementById('thought-bubble') as HTMLDivElement;
    bubble?.addEventListener('click', clickBubble);

}