import { updateStorageDisplay, checkPresence, fetchFullGemma, deleteGemma } from "./model-storage";
import { clickBubble1 } from "./chat";
import { enableGemma } from "./model-details";

// js/main.js
console.log("LLLM: Logic initialized.");

document.addEventListener('DOMContentLoaded', () => {
    setupUIListenerButtons()

    if (enableGemma) {
        const storageInfo = document.getElementById('storage-info') as HTMLDivElement;
        storageInfo!.style.display = 'block';
        const downloadZone = document.getElementById('download-zone') as HTMLDivElement;
        downloadZone!.style.display = 'block';
        updateStorageDisplay();
        checkPresence();
    }
    
    // initMentor()
});

function setupUIListenerButtons() {
    const downloadButton = document.getElementById('btn-download') as HTMLButtonElement;
    downloadButton?.addEventListener('click', fetchFullGemma);
    const deleteButton = document.getElementById('btn-delete') as HTMLButtonElement;
    deleteButton?.addEventListener('click', deleteGemma);

    const bubble1 = document.getElementById('thought-bubble-1') as HTMLDivElement;
    bubble1?.addEventListener('click', clickBubble1, { once: true });

}