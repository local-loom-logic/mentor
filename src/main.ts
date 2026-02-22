import { MODEL_URL, FILENAME } from "./model-details";
import { updateStatus } from "./utils";
import { COLOR_ERROR_RED, COLOR_PROGRESS_PURPLE, COLOR_SUCCESS_GREEN } from "./colors";

import { updateStorageDisplay, checkPresence, fetchFullGemma, deleteGemma } from "./model-storage";

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

}