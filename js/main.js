// Example: Requesting a chunk from Hugging Face
const MODEL_URL = "https://huggingface.co/unsloth/gemma-2b-it-bnb-4bit/resolve/main/model.safetensors";

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
    
    await response.body.pipeTo(writable);
    console.log("Chunk safely stored in the Third Space (local device).");
    updateStatus("Local Logic Secured. Ready to weave.", "#2e7d32");
  }
}

function updateStatus(msg, color) {
    const status = document.getElementById('status');
    
    status.innerText = msg
    status.style.color = color
}

async function initMentor() {
    const filename = "mentor-model-gemma.bin";
    const exists = await isModelLocallyAvailable(filename);

    if (exists) {
        updateStatus("Local Logic Secured. Ready to weave.", "#2e7d32");
    } else {
        updateStatus("Weaving your local mentor (First-time setup)...", "#8b0000");
        await fetchModelChunk(filename); // Your existing download function
    }
}


// js/main.js
console.log("LLLM: Logic initialized.");

document.addEventListener('DOMContentLoaded', () => {

    initMentor()
});