// src/model-details.ts
var GEMMA_FILENAME = "mentor-model-gemma.bin";

// src/serviceWorker.ts
var sw = self;
sw.addEventListener("fetch", (event) => {
  if (event.request.url.includes("gemma-2b-it-q4f16_1-MLC/resolve/main")) {
    console.log("Returning Gemma-2B Weights");
    event.respondWith(
      (async () => {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(GEMMA_FILENAME);
        const file = await fileHandle.getFile();
        return new Response(file, {
          headers: {
            "Content-Type": "application/octet-stream",
            // Crucial for WebGPU: prevent CORS issues in the interceptor
            "Access-Control-Allow-Origin": "*"
          }
        });
      })()
    );
  } else if (event.request.url.includes("gemma-config.json") || event.request.url.includes("mlc-chat-config")) {
    console.log("Returning gemma-config.json");
    event.respondWith(fetch("/gemma-config.json"));
  }
});
