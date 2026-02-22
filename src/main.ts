// Example: Requesting a chunk from Hugging Face
const MODEL_URL = "https://huggingface.co/unsloth/gemma-2b-it-bnb-4bit/resolve/main/model.safetensors";
const FILENAME = "mentor-model-gemma.bin";
const COLOR_SUCCESS_GREEN = "#2e7d32"
const COLOR_ERROR_RED = "#8b0000"
const COLOR_PROGRESS_PURPLE = "#9b8dbd"

/**
 * The Gatekeeper: Checks if the model shard is already "woven" into the local OPFS.
 * @param {string} filename - The name of the file to check.
 * @returns {Promise<boolean>} - True if it exists, False if we need to download.
 */
async function isModelLocallyAvailable(filename) {
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

async function fetchModelChunk(filename) {
  const response = await fetch(MODEL_URL, {
    headers: {
      // Range Request: Only get the first 100MB
      'Range': 'bytes=0-104857600' 
    }
  });

  if (response.status === 206) {
    console.log("Successfully fetched first 100MB chunk.");
    
    // Save to OPFS (The high-prestige local storage)
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    
    await response.body?.pipeTo(writable);
    console.log("Chunk safely stored in the Third Space (local device).");
    updateStatus("Local Logic Secured. Ready to weave.", COLOR_SUCCESS_GREEN);
  }
}

function updateStatus(msg, color) {
    const status = document.getElementById('status') as HTMLElement;
    
    status.innerText = msg
    status.style.color = color
}

async function initMentor() {
    const filename = "mentor-model-gemma.bin";
    const exists = await isModelLocallyAvailable(filename);

    if (exists) {
        updateStatus("Local Logic Secured. Ready to weave.", COLOR_SUCCESS_GREEN);
    } else {
        updateStatus("Weaving your local mentor (First-time setup)...", COLOR_ERROR_RED);
        await fetchModelChunk(filename); // Your existing download function
    }
}

// 1. Update Storage Usage Display
async function updateStorageDisplay() {
    const { usage, quota }: StorageEstimate = await navigator.storage.estimate();
    const usedMB = (usage! / 1024 / 1024).toFixed(2);
    const totalGB = (quota! / 1024 / 1024 / 1024).toFixed(2);
    document.getElementById('storage-info')!.innerText = 
        `Loom Usage: ${usedMB} MB / Total Quota: ${totalGB} GB`;
}

// 2. The Full Download Logic with Progress
async function fetchFullGemma() {
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
async function deleteGemma() {
    if (confirm("Are you sure you want to delete the local weights? (1/3)") && confirm("Are you really sure? (2/3) -- it's a big file!") && confirm("Are you really really sure? (3/3) -- it's a big file!") ) {
        const root = await navigator.storage.getDirectory();
        await root.removeEntry(FILENAME);
        alert("Local weights deleted.");
        checkPresence();
    }
}

// 4. Presence Check (UI Switch)
async function checkPresence() {
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