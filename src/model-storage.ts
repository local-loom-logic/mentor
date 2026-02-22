import { FILENAME, MODEL_URL } from "./model-details";
import { updateStatus } from "./utils";
import { COLOR_ERROR_RED, COLOR_PROGRESS_PURPLE, COLOR_SUCCESS_GREEN } from "./colors";

/**
 * The Gatekeeper: Checks if the model shard is already "woven" into the local OPFS.
 * @param {string} filename - The name of the file to check.
 * @returns {Promise<boolean>} - True if it exists, False if we need to download.
 */
export async function isModelLocallyAvailable(filename) {
    try {
        const root = await navigator.storage.getDirectory();
        // We try to access the file WITHOUT { create: true }
        await root.getFileHandle(filename);
        console.log(`Gatekeeper: ${filename} found. Access granted.`);
        return true;
    } catch (error) {
        if (error.name === 'NotFoundError') {
            console.log(`Gatekeeper: ${filename} not found. Preparing the Loom...`);
            return false;
        }
        // If it's a security or disk error, we should know
        console.error("Gatekeeper encountered a logic block:", error);
        throw error;
    }
}

// 1. Update Storage Usage Display
export async function updateStorageDisplay() {
    const { usage, quota }: StorageEstimate = await navigator.storage.estimate();
    const usedMB = (usage! / 1024 / 1024).toFixed(2);
    const totalGB = (quota! / 1024 / 1024 / 1024).toFixed(2);
    document.getElementById('storage-info')!.innerText = 
        `Loom Usage: ${usedMB} MB / Total Quota: ${totalGB} GB`;
}

// 2. The Full Download Logic with Progress
export async function fetchFullGemma() {
    const btn = document.getElementById('btn-download') as HTMLButtonElement;
    const progress = document.getElementById('progress-bar') as HTMLProgressElement;
    const status = document.getElementById('status');
    
    btn.disabled = true;
    
    try {
        const response = await fetch(MODEL_URL) as Response;
        const reader = response.body!.getReader();
        const contentLength = +(response!.headers!.get('Content-Length')!);
        
        // Open the Loom for writing
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(FILENAME, { create: true });
        const writable = await fileHandle.createWritable();

        let receivedLength = 0;
        
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;

            await writable.write(value); // Write chunk to OPFS
            receivedLength += value.length;
            
            // Update Progress Bar
            const pct = (receivedLength / contentLength) * 100;
            progress.value = pct;
            updateStatus(`Weaving: ${pct.toFixed(1)}% complete...`, COLOR_PROGRESS_PURPLE);
        }

        await writable.close();
        updateStatus("Local Logic (Gemma) Secured. Ready to weave.", COLOR_SUCCESS_GREEN);
        checkPresence(); // Refresh UI
    } catch (err) {
        console.error("Loom Interrupted:", err);
        updateStatus("Error: Check Wi-Fi or Hugging Face access.", COLOR_ERROR_RED);
        btn.disabled = false;
    }
}

// 3. Delete Logic
export async function deleteGemma() {
    if (confirm("Are you sure you want to delete the local weights? (1/3)") && confirm("Are you really sure? (2/3) -- it's a big file!") && confirm("Are you really really sure? (3/3) -- it's a big file!") ) {
        const root = await navigator.storage.getDirectory();
        await root.removeEntry(FILENAME);
        alert("Local weights deleted.");
        checkPresence();
    }
}

// 4. Presence Check (UI Switch)
export async function checkPresence() {
    const exists = await isModelLocallyAvailable(FILENAME); // Your previous Gatekeeper function
    document.getElementById('download-zone')!.style.display = exists ? 'none' : 'block';
    document.getElementById('manage-zone')!.style.display = exists ? 'block' : 'none';
    if (exists) {
        updateStatus("Local Logic (Gemma) Secured. Ready to weave.", COLOR_SUCCESS_GREEN)
    } 
    else {
        updateStatus("Click the button below to start download", COLOR_PROGRESS_PURPLE)
    }
    updateStorageDisplay();
}