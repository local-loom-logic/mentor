
import { MODEL_URL } from "./model-details";
import { updateStatus } from "./utils";
import { COLOR_SUCCESS_GREEN, COLOR_ERROR_RED } from "./colors";
import { isModelLocallyAvailable } from "./model-storage";

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

async function testChunk() {
    const filename = "mosaic-model-gemma.bin";
    const exists = await isModelLocallyAvailable(filename);

    if (exists) {
        updateStatus("Local Logic Secured. Ready to weave.", COLOR_SUCCESS_GREEN);
    } else {
        updateStatus("Weaving your local mosaic (First-time setup)...", COLOR_ERROR_RED);
        await fetchModelChunk(filename); // Your existing download function
    }
}