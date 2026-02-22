import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { GEMMA_FILENAME } from "./model-details";

export async function consultTheMentor(userPrompt: string) {

    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(GEMMA_FILENAME);
    const file = await fileHandle.getFile();

    // 2. Create a local Object URL (This IS a valid URL format)
    const modelObjectURL = URL.createObjectURL(file);
    console.log("URL", modelObjectURL)

    const myGemmaModelID = "my-gemma-2b-it"
    // 1. Point to your local OPFS-hosted binary
    const modelConfig = {
        model: myGemmaModelID, // The model family
        model_list: [
            {
                "model": "./gemma-config.json",
                "model_id": myGemmaModelID,
                // In 2026, engines accept "opfs://" or "local://" schemes
                "model_url": modelObjectURL,
                model_lib: "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-data/gemma-2b-it-q4f16_1-v1-webgpu.wasm",
                "overrides": { "context_window_size": 8192 }
            }
        ]
    };

    // 2. Initialize the engine
    const engine = await CreateMLCEngine(myGemmaModelID, {
        appConfig: modelConfig,
        initProgressCallback: (p) => console.log(`Waking the Mentor: ${p.text}`)
    });

    // 3. Process the prompt
    const messages = [
        { role: "system" as const, content: "You are a wise mentor for the Chinese diaspora." },
        { role: "user" as const, content: userPrompt }
    ];

    const reply = await engine.chat.completions.create({ messages });
    return reply.choices[0].message.content;
}