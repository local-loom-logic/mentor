import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { myGemmaModelID } from "./model-details";

import { prebuiltAppConfig } from "@mlc-ai/web-llm";

// 1. Find the official Gemma record
const officialGemmaRecord = prebuiltAppConfig.model_list.find(
    m => m.model_id === "gemma-2b-it-q4f16_1-MLC"
);

if (!officialGemmaRecord) {
    throw new Error("Gemma was not found in the official archives.");
}

export async function consultTheMentor(userPrompt: string) {
    console.log("Starting to consult Gemma...")
    // 1. Point to your local OPFS-hosted binary
    const modelConfig = {
        model: myGemmaModelID, // The model family
        model_list: [
            {
                "model": `${window.location.origin}/gemma-config.json`, // This gets intercepted by service worker
                "model_id": myGemmaModelID,
                // In 2026, engines accept "opfs://" or "local://" schemes
                "model_url": "https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC", // This gets intercepted by service worker
                model_lib: officialGemmaRecord!.model_lib,
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